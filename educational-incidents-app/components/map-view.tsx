"use client"

import type React from "react"

import { useRef, useState } from "react"
import type { IncidentData } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Users, Calendar } from "lucide-react"

interface MapViewProps {
  incidents: IncidentData[]
  mode: "markers" | "heatmap"
  onIncidentSelect: (incident: IncidentData) => void
  selectedIncident: IncidentData | null
}

export function MapView({ incidents, mode, onIncidentSelect, selectedIncident }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [hoveredIncident, setHoveredIncident] = useState<IncidentData | null>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  // Calculate bounds for the map
  const bounds = incidents.reduce(
    (acc, incident) => ({
      minLat: Math.min(acc.minLat, incident.latitude),
      maxLat: Math.max(acc.maxLat, incident.latitude),
      minLng: Math.min(acc.minLng, incident.longitude),
      maxLng: Math.max(acc.maxLng, incident.longitude),
    }),
    {
      minLat: Number.POSITIVE_INFINITY,
      maxLat: Number.NEGATIVE_INFINITY,
      minLng: Number.POSITIVE_INFINITY,
      maxLng: Number.NEGATIVE_INFINITY,
    },
  )

  // Convert lat/lng to screen coordinates
  const latLngToPixel = (lat: number, lng: number) => {
    if (!mapRef.current) return { x: 0, y: 0 }

    const rect = mapRef.current.getBoundingClientRect()
    const x = ((lng - bounds.minLng) / (bounds.maxLng - bounds.minLng)) * rect.width
    const y = ((bounds.maxLat - lat) / (bounds.maxLat - bounds.minLat)) * rect.height

    return { x, y }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "low":
        return "bg-green-500"
      case "medium":
        return "bg-yellow-500"
      case "high":
        return "bg-orange-500"
      case "critical":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getSeveritySize = (severity: string) => {
    switch (severity) {
      case "low":
        return "w-3 h-3"
      case "medium":
        return "w-4 h-4"
      case "high":
        return "w-5 h-5"
      case "critical":
        return "w-6 h-6"
      default:
        return "w-3 h-3"
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY })
  }

  return (
    <div className="relative w-full h-full bg-muted/20" onMouseMove={handleMouseMove}>
      {/* Map Background */}
      <div
        ref={mapRef}
        className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-950/20 dark:to-green-950/20"
        style={{
          backgroundImage: `
            radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, rgba(34, 197, 94, 0.1) 0%, transparent 50%)
          `,
        }}
      >
        {/* Grid overlay for geographic reference */}
        <div className="absolute inset-0 opacity-20">
          <svg width="100%" height="100%" className="text-border">
            <defs>
              <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                <path d="M 50 0 L 0 0 0 50" fill="none" stroke="currentColor" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* State boundaries simulation */}
        <div className="absolute inset-0">
          <svg width="100%" height="100%" className="text-border/40">
            <path d="M 200 100 Q 300 150 400 100 T 600 120" fill="none" stroke="currentColor" strokeWidth="2" />
            <path d="M 100 200 Q 250 180 400 200 T 700 220" fill="none" stroke="currentColor" strokeWidth="2" />
            <path d="M 150 300 Q 350 280 550 300 T 750 320" fill="none" stroke="currentColor" strokeWidth="2" />
          </svg>
        </div>

        {/* Incidents */}
        {mode === "markers" &&
          incidents.map((incident) => {
            const position = latLngToPixel(incident.latitude, incident.longitude)
            const isSelected = selectedIncident?.id === incident.id

            return (
              <div
                key={incident.id}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200 hover:scale-110 ${
                  isSelected ? "z-20 scale-125" : "z-10"
                }`}
                style={{ left: position.x, top: position.y }}
                onClick={() => onIncidentSelect(incident)}
                onMouseEnter={() => setHoveredIncident(incident)}
                onMouseLeave={() => setHoveredIncident(null)}
              >
                <div
                  className={`
                ${getSeverityColor(incident.severity)} 
                ${getSeveritySize(incident.severity)}
                rounded-full border-2 border-white dark:border-gray-800 shadow-lg
                ${isSelected ? "ring-4 ring-primary/50" : ""}
              `}
                />

                {/* Pulse animation for critical incidents */}
                {incident.severity === "critical" && (
                  <div className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-75" />
                )}
              </div>
            )
          })}

        {/* Heatmap mode */}
        {mode === "heatmap" &&
          incidents.map((incident) => {
            const position = latLngToPixel(incident.latitude, incident.longitude)
            const intensity =
              incident.severity === "critical"
                ? 0.8
                : incident.severity === "high"
                  ? 0.6
                  : incident.severity === "medium"
                    ? 0.4
                    : 0.2

            return (
              <div
                key={incident.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                style={{ left: position.x, top: position.y }}
              >
                <div
                  className="w-20 h-20 rounded-full"
                  style={{
                    background: `radial-gradient(circle, rgba(239, 68, 68, ${intensity}) 0%, transparent 70%)`,
                    filter: "blur(8px)",
                  }}
                />
              </div>
            )
          })}
      </div>

      {/* Hover tooltip */}
      {hoveredIncident && mode === "markers" && (
        <div
          className="fixed z-50 pointer-events-none"
          style={{
            left: mousePosition.x + 10,
            top: mousePosition.y - 10,
            transform: "translateY(-100%)",
          }}
        >
          <Card className="shadow-lg border-2">
            <CardContent className="p-3 space-y-2">
              <div className="font-semibold text-sm">{hoveredIncident.institutionName}</div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <MapPin className="w-3 h-3" />
                {hoveredIncident.city}, {hoveredIncident.state}
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Users className="w-3 h-3" />
                {hoveredIncident.affectedCount} afectados
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="w-3 h-3" />
                {new Date(hoveredIncident.date).toLocaleDateString("es-ES")}
              </div>
              <Badge
                variant={
                  hoveredIncident.severity === "critical"
                    ? "destructive"
                    : hoveredIncident.severity === "high"
                      ? "destructive"
                      : hoveredIncident.severity === "medium"
                        ? "default"
                        : "secondary"
                }
                className="text-xs"
              >
                {hoveredIncident.severity.toUpperCase()}
              </Badge>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Map legend */}
      <div className="absolute bottom-4 left-4 bg-card/90 backdrop-blur-sm rounded-lg p-4 shadow-lg">
        <h3 className="font-semibold text-sm mb-3">Nivel de Severidad</h3>
        <div className="space-y-2">
          {[
            { level: "Bajo", color: "bg-green-500", severity: "low" },
            { level: "Medio", color: "bg-yellow-500", severity: "medium" },
            { level: "Alto", color: "bg-orange-500", severity: "high" },
            { level: "Crítico", color: "bg-red-500", severity: "critical" },
          ].map(({ level, color, severity }) => (
            <div key={severity} className="flex items-center gap-2 text-xs">
              <div className={`w-3 h-3 rounded-full ${color}`} />
              <span>{level}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Incident count */}
      <div className="absolute top-4 right-4 bg-card/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
        <div className="text-sm font-medium">{incidents.length} incidentes mostrados</div>
        <div className="text-xs text-muted-foreground">Modo: {mode === "markers" ? "Marcadores" : "Mapa de Calor"}</div>
      </div>
    </div>
  )
}
