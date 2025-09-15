"use client"

import type React from "react"
import { useRef, useEffect, useState } from "react"
import type { IncidentData, Filters } from "@/lib/types"
import { useHeatGrid } from "@/lib/hooks/use-incidents"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Users, Calendar, AlertTriangle } from "lucide-react"
import maplibregl from "maplibre-gl"
import "maplibre-gl/dist/maplibre-gl.css"
import type { GeoJSON } from "geojson"

interface MapViewProps {
  incidents: IncidentData[]
  mode: "markers" | "heatmap"
  onIncidentSelect: (incident: IncidentData) => void
  selectedIncident: IncidentData | null
  filters?: Filters
}

export function MapView({ incidents, mode, onIncidentSelect, selectedIncident, filters }: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<maplibregl.Map | null>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [hoveredIncident, setHoveredIncident] = useState<IncidentData | null>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const { data: heatGridData } = useHeatGrid(filters)

  useEffect(() => {
    if (!mapContainer.current || map.current) return

    const mapStyleUrl =
      process.env.NEXT_PUBLIC_MAP_STYLE_URL ||
      (process.env.NEXT_PUBLIC_MAPTILER_KEY
        ? `https://api.maptiler.com/maps/streets/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_KEY}`
        : null)

    if (!mapStyleUrl) {
      console.warn("No map style URL configured. Using fallback OSM tiles.")
      map.current = new maplibregl.Map({
        container: mapContainer.current,
        style: {
          version: 8,
          sources: {
            osm: {
              type: "raster",
              tiles: ["https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"],
              tileSize: 256,
              attribution: "© OpenStreetMap contributors",
            },
          },
          layers: [
            {
              id: "osm",
              type: "raster",
              source: "osm",
            },
          ],
        },
        center: [-98.5795, 39.8283], // Center of USA
        zoom: 4,
        attributionControl: true,
      })
    } else {
      map.current = new maplibregl.Map({
        container: mapContainer.current,
        style: mapStyleUrl,
        center: [-98.5795, 39.8283], // Center of USA
        zoom: 4,
        attributionControl: true,
      })
    }

    map.current.addControl(new maplibregl.NavigationControl(), "top-right")

    map.current.on("load", () => {
      setMapLoaded(true)
    })

    map.current.on("error", (e) => {
      console.error("Map error:", e)
    })

    return () => {
      if (map.current) {
        map.current.remove()
        map.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (!map.current || !mapLoaded) return

    if (map.current.getSource("incidents")) {
      if (map.current.getLayer("incidents-layer")) {
        map.current.removeLayer("incidents-layer")
      }
      if (map.current.getLayer("incidents-selected")) {
        map.current.removeLayer("incidents-selected")
      }
      map.current.removeSource("incidents")
    }

    if (mode === "markers" && incidents.length > 0) {
      const geojson: GeoJSON.FeatureCollection = {
        type: "FeatureCollection",
        features: incidents.map((incident) => ({
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [incident.longitude, incident.latitude],
          },
          properties: {
            id: incident.id,
            institutionName: incident.institutionName,
            city: incident.city,
            state: incident.state,
            affectedCount: incident.affectedCount,
            date: incident.date,
            severity: incident.severity,
            description: incident.description,
          },
        })),
      }

      map.current.addSource("incidents", {
        type: "geojson",
        data: geojson,
        cluster: true,
        clusterMaxZoom: 14,
        clusterRadius: 50,
      })

      map.current.addLayer({
        id: "clusters",
        type: "circle",
        source: "incidents",
        filter: ["has", "point_count"],
        paint: {
          "circle-color": ["step", ["get", "point_count"], "#51bbd6", 100, "#f1f075", 750, "#f28cb1"],
          "circle-radius": ["step", ["get", "point_count"], 20, 100, 30, 750, 40],
        },
      })

      map.current.addLayer({
        id: "cluster-count",
        type: "symbol",
        source: "incidents",
        filter: ["has", "point_count"],
        layout: {
          "text-field": "{point_count_abbreviated}",
          "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
          "text-size": 12,
        },
      })

      map.current.addLayer({
        id: "incidents-layer",
        type: "circle",
        source: "incidents",
        filter: ["!", ["has", "point_count"]],
        paint: {
          "circle-color": [
            "match",
            ["get", "severity"],
            "low",
            "#22c55e",
            "medium",
            "#eab308",
            "high",
            "#f97316",
            "critical",
            "#ef4444",
            "#6b7280",
          ],
          "circle-radius": ["match", ["get", "severity"], "low", 6, "medium", 8, "high", 10, "critical", 12, 6],
          "circle-stroke-width": 2,
          "circle-stroke-color": "#ffffff",
        },
      })

      map.current.addLayer({
        id: "incidents-selected",
        type: "circle",
        source: "incidents",
        filter: ["==", ["get", "id"], selectedIncident?.id || ""],
        paint: {
          "circle-color": "#3b82f6",
          "circle-radius": 15,
          "circle-stroke-width": 3,
          "circle-stroke-color": "#ffffff",
        },
      })

      map.current.on("click", "incidents-layer", (e) => {
        if (e.features && e.features[0]) {
          const feature = e.features[0]
          const incident = incidents.find((i) => i.id === feature.properties?.id)
          if (incident) {
            onIncidentSelect(incident)
          }
        }
      })

      map.current.on("click", "clusters", (e) => {
        if (e.features && e.features[0]) {
          const features = map.current!.queryRenderedFeatures(e.point, {
            layers: ["clusters"],
          })
          const clusterId = features[0].properties?.cluster_id
          const source = map.current!.getSource("incidents") as maplibregl.GeoJSONSource
          source.getClusterExpansionZoom(clusterId, (err, zoom) => {
            if (err) return
            map.current!.easeTo({
              center: (features[0].geometry as GeoJSON.Point).coordinates as [number, number],
              zoom: zoom,
            })
          })
        }
      })

      map.current.on("mouseenter", "incidents-layer", () => {
        if (map.current) map.current.getCanvas().style.cursor = "pointer"
      })
      map.current.on("mouseleave", "incidents-layer", () => {
        if (map.current) map.current.getCanvas().style.cursor = ""
      })

      if (incidents.length > 0) {
        const bounds = new maplibregl.LngLatBounds()
        incidents.forEach((incident) => {
          bounds.extend([incident.longitude, incident.latitude])
        })
        map.current.fitBounds(bounds, { padding: 50 })
      }
    }
  }, [incidents, mapLoaded, mode, selectedIncident, onIncidentSelect])

  useEffect(() => {
    if (!map.current || !mapLoaded) return

    if (map.current.getSource("heatmap")) {
      if (map.current.getLayer("heatmap-layer")) {
        map.current.removeLayer("heatmap-layer")
      }
      map.current.removeSource("heatmap")
    }

    if (mode === "heatmap" && heatGridData && heatGridData.length > 0) {
      const heatmapGeoJSON: GeoJSON.FeatureCollection = {
        type: "FeatureCollection",
        features: heatGridData.map((cell) => ({
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [cell.lng, cell.lat],
          },
          properties: {
            incidents: cell.incidents,
          },
        })),
      }

      map.current.addSource("heatmap", {
        type: "geojson",
        data: heatmapGeoJSON,
      })

      map.current.addLayer({
        id: "heatmap-layer",
        type: "heatmap",
        source: "heatmap",
        maxzoom: 15,
        paint: {
          "heatmap-weight": ["interpolate", ["linear"], ["get", "incidents"], 0, 0, 10, 1],
          "heatmap-intensity": ["interpolate", ["linear"], ["zoom"], 0, 1, 15, 3],
          "heatmap-color": [
            "interpolate",
            ["linear"],
            ["heatmap-density"],
            0,
            "rgba(33,102,172,0)",
            0.2,
            "rgb(103,169,207)",
            0.4,
            "rgb(209,229,240)",
            0.6,
            "rgb(253,219,199)",
            0.8,
            "rgb(239,138,98)",
            1,
            "rgb(178,24,43)",
          ],
          "heatmap-radius": ["interpolate", ["linear"], ["zoom"], 0, 2, 15, 20],
          "heatmap-opacity": ["interpolate", ["linear"], ["zoom"], 7, 1, 15, 0],
        },
      })
    }
  }, [mode, heatGridData, mapLoaded])

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY })
  }

  if (!process.env.NEXT_PUBLIC_MAP_STYLE_URL && !process.env.NEXT_PUBLIC_MAPTILER_KEY) {
    return (
      <div className="flex items-center justify-center h-full bg-muted/20">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Mapa no disponible</h3>
            <p className="text-sm text-muted-foreground mb-4">
              No se pudo cargar el mapa base. Configure NEXT_PUBLIC_MAPTILER_KEY en las variables de entorno.
            </p>
            <div className="text-xs text-muted-foreground">{incidents.length} incidentes disponibles en modo tabla</div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="relative w-full h-full" onMouseMove={handleMouseMove}>
      <div ref={mapContainer} className="absolute inset-0" style={{ minHeight: "400px" }} />

      {!mapLoaded && (
        <div className="absolute inset-0 bg-muted/50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-sm text-muted-foreground">Cargando mapa...</p>
          </div>
        </div>
      )}

      {hoveredIncident && (
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

      <div className="absolute top-4 right-4 bg-card/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
        <div className="text-sm font-medium">{incidents.length} incidentes mostrados</div>
        <div className="text-xs text-muted-foreground">Modo: {mode === "markers" ? "Marcadores" : "Mapa de Calor"}</div>
      </div>
    </div>
  )
}
