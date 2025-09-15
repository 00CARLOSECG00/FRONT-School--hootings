"use client"

import { useState, useEffect } from "react"
import type { IncidentData } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, MapPin, School, AlertTriangle, RotateCcw } from "lucide-react"

interface FilterSidebarProps {
  incidents: IncidentData[]
  onFilterChange: (filteredIncidents: IncidentData[]) => void
}

interface Filters {
  dateRange: {
    start: string
    end: string
  }
  states: string[]
  institutionTypes: string[]
  severityLevels: string[]
  affectedCountRange: {
    min: number
    max: number
  }
}

export function FilterSidebar({ incidents, onFilterChange }: FilterSidebarProps) {
  const [filters, setFilters] = useState<Filters>({
    dateRange: { start: "", end: "" },
    states: [],
    institutionTypes: [],
    severityLevels: [],
    affectedCountRange: { min: 0, max: 1000 },
  })

  // Get unique values for filter options
  const uniqueStates = [...new Set(incidents.map((i) => i.state))].sort()
  const uniqueInstitutionTypes = [...new Set(incidents.map((i) => i.institutionType))].sort()
  const severityOptions = ["low", "medium", "high", "critical"]

  // Apply filters
  useEffect(() => {
    let filtered = incidents

    // Date range filter
    if (filters.dateRange.start) {
      filtered = filtered.filter((i) => new Date(i.date) >= new Date(filters.dateRange.start))
    }
    if (filters.dateRange.end) {
      filtered = filtered.filter((i) => new Date(i.date) <= new Date(filters.dateRange.end))
    }

    // State filter
    if (filters.states.length > 0) {
      filtered = filtered.filter((i) => filters.states.includes(i.state))
    }

    // Institution type filter
    if (filters.institutionTypes.length > 0) {
      filtered = filtered.filter((i) => filters.institutionTypes.includes(i.institutionType))
    }

    // Severity filter
    if (filters.severityLevels.length > 0) {
      filtered = filtered.filter((i) => filters.severityLevels.includes(i.severity))
    }

    // Affected count filter
    filtered = filtered.filter(
      (i) => i.affectedCount >= filters.affectedCountRange.min && i.affectedCount <= filters.affectedCountRange.max,
    )

    onFilterChange(filtered)
  }, [filters, incidents, onFilterChange])

  const handleStateToggle = (state: string) => {
    setFilters((prev) => ({
      ...prev,
      states: prev.states.includes(state) ? prev.states.filter((s) => s !== state) : [...prev.states, state],
    }))
  }

  const handleInstitutionTypeToggle = (type: string) => {
    setFilters((prev) => ({
      ...prev,
      institutionTypes: prev.institutionTypes.includes(type)
        ? prev.institutionTypes.filter((t) => t !== type)
        : [...prev.institutionTypes, type],
    }))
  }

  const handleSeverityToggle = (severity: string) => {
    setFilters((prev) => ({
      ...prev,
      severityLevels: prev.severityLevels.includes(severity)
        ? prev.severityLevels.filter((s) => s !== severity)
        : [...prev.severityLevels, severity],
    }))
  }

  const resetFilters = () => {
    setFilters({
      dateRange: { start: "", end: "" },
      states: [],
      institutionTypes: [],
      severityLevels: [],
      affectedCountRange: { min: 0, max: 1000 },
    })
  }

  const getInstitutionTypeLabel = (type: string) => {
    const labels = {
      elementary: "Primaria",
      middle: "Secundaria",
      high: "Preparatoria",
      university: "Universidad",
    }
    return labels[type as keyof typeof labels] || type
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

  return (
    <div className="h-full overflow-y-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Filtros</h2>
        <Button variant="outline" size="sm" onClick={resetFilters}>
          <RotateCcw className="w-4 h-4 mr-2" />
          Limpiar
        </Button>
      </div>

      {/* Date Range Filter */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <CalendarDays className="w-4 h-4" />
            Rango de Fechas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label htmlFor="start-date" className="text-xs">
              Fecha de inicio
            </Label>
            <Input
              id="start-date"
              type="date"
              value={filters.dateRange.start}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  dateRange: { ...prev.dateRange, start: e.target.value },
                }))
              }
            />
          </div>
          <div>
            <Label htmlFor="end-date" className="text-xs">
              Fecha de fin
            </Label>
            <Input
              id="end-date"
              type="date"
              value={filters.dateRange.end}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  dateRange: { ...prev.dateRange, end: e.target.value },
                }))
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* States Filter */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Estados ({filters.states.length} seleccionados)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {uniqueStates.map((state) => (
              <div key={state} className="flex items-center space-x-2">
                <Checkbox
                  id={`state-${state}`}
                  checked={filters.states.includes(state)}
                  onCheckedChange={() => handleStateToggle(state)}
                />
                <Label htmlFor={`state-${state}`} className="text-sm font-normal">
                  {state}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Institution Type Filter */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <School className="w-4 h-4" />
            Tipo de Institución
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {uniqueInstitutionTypes.map((type) => (
              <div key={type} className="flex items-center space-x-2">
                <Checkbox
                  id={`type-${type}`}
                  checked={filters.institutionTypes.includes(type)}
                  onCheckedChange={() => handleInstitutionTypeToggle(type)}
                />
                <Label htmlFor={`type-${type}`} className="text-sm font-normal flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      type === "elementary"
                        ? "bg-green-500"
                        : type === "middle"
                          ? "bg-yellow-500"
                          : type === "high"
                            ? "bg-orange-500"
                            : "bg-red-500"
                    }`}
                  />
                  {getInstitutionTypeLabel(type)}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Severity Filter */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Nivel de Severidad
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {severityOptions.map((severity) => (
              <div key={severity} className="flex items-center space-x-2">
                <Checkbox
                  id={`severity-${severity}`}
                  checked={filters.severityLevels.includes(severity)}
                  onCheckedChange={() => handleSeverityToggle(severity)}
                />
                <Label htmlFor={`severity-${severity}`} className="text-sm font-normal flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      severity === "low"
                        ? "bg-green-500"
                        : severity === "medium"
                          ? "bg-yellow-500"
                          : severity === "high"
                            ? "bg-orange-500"
                            : "bg-red-500"
                    }`}
                  />
                  {getSeverityLabel(severity)}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Affected Count Range */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Número de Afectados</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="min-affected" className="text-xs">
                Mínimo
              </Label>
              <Input
                id="min-affected"
                type="number"
                min="0"
                value={filters.affectedCountRange.min}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    affectedCountRange: { ...prev.affectedCountRange, min: Number.parseInt(e.target.value) || 0 },
                  }))
                }
              />
            </div>
            <div>
              <Label htmlFor="max-affected" className="text-xs">
                Máximo
              </Label>
              <Input
                id="max-affected"
                type="number"
                min="0"
                value={filters.affectedCountRange.max}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    affectedCountRange: { ...prev.affectedCountRange, max: Number.parseInt(e.target.value) || 1000 },
                  }))
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Filters Summary */}
      {(filters.states.length > 0 || filters.institutionTypes.length > 0 || filters.severityLevels.length > 0) && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Filtros Activos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {filters.states.length > 0 && (
                <div>
                  <Label className="text-xs text-muted-foreground">Estados:</Label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {filters.states.map((state) => (
                      <Badge key={state} variant="secondary" className="text-xs">
                        {state}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {filters.institutionTypes.length > 0 && (
                <div>
                  <Label className="text-xs text-muted-foreground">Tipos:</Label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {filters.institutionTypes.map((type) => (
                      <Badge key={type} variant="secondary" className="text-xs">
                        {getInstitutionTypeLabel(type)}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {filters.severityLevels.length > 0 && (
                <div>
                  <Label className="text-xs text-muted-foreground">Severidad:</Label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {filters.severityLevels.map((severity) => (
                      <Badge key={severity} variant="secondary" className="text-xs">
                        {getSeverityLabel(severity)}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
