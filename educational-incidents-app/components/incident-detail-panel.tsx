"use client"

import type { IncidentData } from "@/app/dashboard/page"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { X, MapPin, Calendar, Users, School, AlertTriangle, ExternalLink } from "lucide-react"

interface IncidentDetailPanelProps {
  incident: IncidentData
  onClose: () => void
}

export function IncidentDetailPanel({ incident, onClose }: IncidentDetailPanelProps) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "high":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
      case "critical":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const getSeverityLabel = (severity: string) => {
    const labels = {
      low: "Bajo",
      medium: "Medio",
      high: "Alto",
      critical: "Crítico",
    }
    return labels[severity as keyof typeof labels] || severity
  }

  const getInstitutionTypeLabel = (type: string) => {
    const labels = {
      elementary: "Escuela Primaria",
      middle: "Escuela Secundaria",
      high: "Escuela Preparatoria",
      university: "Universidad",
    }
    return labels[type as keyof typeof labels] || type
  }

  return (
    <div className="h-full flex flex-col bg-card">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold">Detalles del Incidente</h2>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Institution Info */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <School className="w-5 h-5" />
              {incident.institutionName}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4" />
              {incident.city}, {incident.state}
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Badge variant="outline">{getInstitutionTypeLabel(incident.institutionType)}</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Incident Details */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Información del Incidente</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-muted-foreground mb-1">Fecha</div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4" />
                  {new Date(incident.date).toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">Personas Afectadas</div>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="w-4 h-4" />
                  {incident.affectedCount}
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <div className="text-xs text-muted-foreground mb-2">Nivel de Severidad</div>
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                <Badge className={getSeverityColor(incident.severity)}>{getSeverityLabel(incident.severity)}</Badge>
              </div>
            </div>

            {incident.description && (
              <>
                <Separator />
                <div>
                  <div className="text-xs text-muted-foreground mb-2">Descripción</div>
                  <p className="text-sm text-pretty">{incident.description}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Source Information */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Fuente de Información</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-sm">{incident.source}</span>
              <Button variant="outline" size="sm">
                <ExternalLink className="w-4 h-4 mr-2" />
                Ver Fuente
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Geographic Coordinates */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Coordenadas Geográficas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-xs text-muted-foreground mb-1">Latitud</div>
                <div className="font-mono">{incident.latitude.toFixed(6)}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">Longitud</div>
                <div className="font-mono">{incident.longitude.toFixed(6)}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="space-y-2">
          <Button variant="outline" className="w-full bg-transparent">
            <ExternalLink className="w-4 h-4 mr-2" />
            Compartir Incidente
          </Button>
          <Button variant="outline" className="w-full bg-transparent">
            Exportar Datos
          </Button>
        </div>
      </div>
    </div>
  )
}
