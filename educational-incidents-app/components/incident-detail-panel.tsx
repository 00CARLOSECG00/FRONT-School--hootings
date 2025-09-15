"use client"

import type { IncidentData } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { X, MapPin, Calendar, Users, School, AlertTriangle, ExternalLink, Shield, Target } from "lucide-react"

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

  const csvData = incident.csvData

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
              {csvData?.enrollment && (
                <Badge variant="secondary">{csvData.enrollment.toLocaleString()} estudiantes</Badge>
              )}
            </div>
            {csvData?.low_grade && csvData?.high_grade && (
              <div className="text-sm text-muted-foreground">
                Grados: {csvData.low_grade} - {csvData.high_grade}
              </div>
            )}
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
                {csvData?.day_of_week && (
                  <div className="text-xs text-muted-foreground mt-1">
                    {csvData.day_of_week}
                    {csvData.time && ` - ${csvData.time}`}
                  </div>
                )}
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">Personas Afectadas</div>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="w-4 h-4" />
                  {incident.affectedCount}
                </div>
                {csvData && (csvData.killed > 0 || csvData.injured > 0) && (
                  <div className="text-xs text-muted-foreground mt-1">
                    {csvData.killed > 0 && `${csvData.killed} fallecidos`}
                    {csvData.killed > 0 && csvData.injured > 0 && ", "}
                    {csvData.injured > 0 && `${csvData.injured} heridos`}
                  </div>
                )}
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

            {csvData?.shooting_type && (
              <>
                <Separator />
                <div>
                  <div className="text-xs text-muted-foreground mb-2">Tipo de Incidente</div>
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    <span className="text-sm">{csvData.shooting_type}</span>
                  </div>
                </div>
              </>
            )}

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

        {csvData && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Información de Seguridad
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Oficial de Recursos:</span>
                <Badge variant={csvData.resource_officer ? "default" : "secondary"}>
                  {csvData.resource_officer ? "Presente" : "No presente"}
                </Badge>
              </div>
              {csvData.weapon && (
                <div className="flex items-center justify-between">
                  <span className="text-sm">Arma utilizada:</span>
                  <span className="text-sm font-medium">{csvData.weapon}</span>
                </div>
              )}
              {csvData.weapon_source && (
                <div className="flex items-center justify-between">
                  <span className="text-sm">Origen del arma:</span>
                  <span className="text-sm">{csvData.weapon_source}</span>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {csvData && (csvData.age_shooter1 || csvData.gender_shooter1) && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Información del Agresor</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {csvData.age_shooter1 && (
                <div className="flex items-center justify-between">
                  <span className="text-sm">Edad:</span>
                  <span className="text-sm font-medium">{csvData.age_shooter1} años</span>
                </div>
              )}
              {csvData.gender_shooter1 && (
                <div className="flex items-center justify-between">
                  <span className="text-sm">Género:</span>
                  <span className="text-sm">{csvData.gender_shooter1}</span>
                </div>
              )}
              {csvData.race_ethnicity_shooter1 && (
                <div className="flex items-center justify-between">
                  <span className="text-sm">Etnia:</span>
                  <span className="text-sm">{csvData.race_ethnicity_shooter1}</span>
                </div>
              )}
              {csvData.shooter_relationship1 && (
                <div className="flex items-center justify-between">
                  <span className="text-sm">Relación:</span>
                  <span className="text-sm">{csvData.shooter_relationship1}</span>
                </div>
              )}
              {csvData.shooter_deceased1 !== undefined && (
                <div className="flex items-center justify-between">
                  <span className="text-sm">Estado:</span>
                  <Badge variant={csvData.shooter_deceased1 ? "destructive" : "default"}>
                    {csvData.shooter_deceased1 ? "Fallecido" : "Vivo"}
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>
        )}

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
            {csvData && (
              <div className="mt-3 space-y-1">
                {csvData.county && <div className="text-xs text-muted-foreground">Condado: {csvData.county}</div>}
                {csvData.ulocale && <div className="text-xs text-muted-foreground">Ubicación: {csvData.ulocale}</div>}
              </div>
            )}
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
