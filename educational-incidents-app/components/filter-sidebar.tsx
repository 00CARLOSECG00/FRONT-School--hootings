"use client"

import { useState, useEffect } from "react"
import type { Filters } from "@/lib/types"
import { useLookups } from "@/lib/hooks/use-incidents"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, MapPin, School, AlertTriangle, RotateCcw, Shield } from "lucide-react"

interface FilterSidebarProps {
  filters: Filters
  onFiltersChange: (filters: Filters) => void
}

export function FilterSidebar({ filters, onFiltersChange }: FilterSidebarProps) {
  const { data: lookupData, isLoading } = useLookups()

  const [localFilters, setLocalFilters] = useState<Filters>(filters)

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onFiltersChange(localFilters)
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [localFilters, onFiltersChange])

  const handleStateToggle = (state: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      state: prev.state?.includes(state) ? prev.state.filter((s) => s !== state) : [...(prev.state || []), state],
    }))
  }

  const handleSchoolTypeToggle = (type: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      school_type: prev.school_type?.includes(type)
        ? prev.school_type.filter((t) => t !== type)
        : [...(prev.school_type || []), type],
    }))
  }

  const handleShootingTypeToggle = (type: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      shooting_type: prev.shooting_type?.includes(type)
        ? prev.shooting_type.filter((t) => t !== type)
        : [...(prev.shooting_type || []), type],
    }))
  }

  const resetFilters = () => {
    const emptyFilters: Filters = {}
    setLocalFilters(emptyFilters)
    onFiltersChange(emptyFilters)
  }

  const getSchoolTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      Elementary: "Primaria",
      Middle: "Secundaria",
      High: "Preparatoria",
      "K-12": "K-12",
      Alternative: "Alternativa",
      Special: "Especial",
    }
    return labels[type] || type
  }

  if (isLoading) {
    return (
      <div className="h-full overflow-y-auto p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-muted rounded w-3/4"></div>
          <div className="h-32 bg-muted rounded"></div>
          <div className="h-32 bg-muted rounded"></div>
        </div>
      </div>
    )
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
              value={localFilters.from || ""}
              onChange={(e) =>
                setLocalFilters((prev) => ({
                  ...prev,
                  from: e.target.value || undefined,
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
              value={localFilters.to || ""}
              onChange={(e) =>
                setLocalFilters((prev) => ({
                  ...prev,
                  to: e.target.value || undefined,
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
            Estados ({localFilters.state?.length || 0} seleccionados)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {lookupData?.states.map((state) => (
              <div key={state} className="flex items-center space-x-2">
                <Checkbox
                  id={`state-${state}`}
                  checked={localFilters.state?.includes(state) || false}
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

      {/* School Type Filter */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <School className="w-4 h-4" />
            Tipo de Escuela
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {lookupData?.school_types.map((type) => (
              <div key={type} className="flex items-center space-x-2">
                <Checkbox
                  id={`type-${type}`}
                  checked={localFilters.school_type?.includes(type) || false}
                  onCheckedChange={() => handleSchoolTypeToggle(type)}
                />
                <Label htmlFor={`type-${type}`} className="text-sm font-normal">
                  {getSchoolTypeLabel(type)}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Shooting Type Filter */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Tipo de Incidente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {lookupData?.shooting_types.map((type) => (
              <div key={type} className="flex items-center space-x-2">
                <Checkbox
                  id={`shooting-${type}`}
                  checked={localFilters.shooting_type?.includes(type) || false}
                  onCheckedChange={() => handleShootingTypeToggle(type)}
                />
                <Label htmlFor={`shooting-${type}`} className="text-sm font-normal">
                  {type}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Casualty Range Filters */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Víctimas Mortales</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="min-killed" className="text-xs">
                Mínimo
              </Label>
              <Input
                id="min-killed"
                type="number"
                min="0"
                value={localFilters.min_killed || ""}
                onChange={(e) =>
                  setLocalFilters((prev) => ({
                    ...prev,
                    min_killed: e.target.value ? Number.parseInt(e.target.value) : undefined,
                  }))
                }
              />
            </div>
            <div>
              <Label htmlFor="max-killed" className="text-xs">
                Máximo
              </Label>
              <Input
                id="max-killed"
                type="number"
                min="0"
                value={localFilters.max_killed || ""}
                onChange={(e) =>
                  setLocalFilters((prev) => ({
                    ...prev,
                    max_killed: e.target.value ? Number.parseInt(e.target.value) : undefined,
                  }))
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resource Officer Filter */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Oficial de Seguridad
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="has-resource-officer"
              checked={localFilters.has_resource_officer || false}
              onCheckedChange={(checked) =>
                setLocalFilters((prev) => ({
                  ...prev,
                  has_resource_officer: checked ? true : undefined,
                }))
              }
            />
            <Label htmlFor="has-resource-officer" className="text-sm font-normal">
              Solo escuelas con oficial de seguridad
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Active Filters Summary */}
      {(localFilters.state?.length || localFilters.school_type?.length || localFilters.shooting_type?.length) && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Filtros Activos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {localFilters.state && localFilters.state.length > 0 && (
                <div>
                  <Label className="text-xs text-muted-foreground">Estados:</Label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {localFilters.state.map((state) => (
                      <Badge key={state} variant="secondary" className="text-xs">
                        {state}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {localFilters.school_type && localFilters.school_type.length > 0 && (
                <div>
                  <Label className="text-xs text-muted-foreground">Tipos:</Label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {localFilters.school_type.map((type) => (
                      <Badge key={type} variant="secondary" className="text-xs">
                        {getSchoolTypeLabel(type)}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {localFilters.shooting_type && localFilters.shooting_type.length > 0 && (
                <div>
                  <Label className="text-xs text-muted-foreground">Incidentes:</Label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {localFilters.shooting_type.map((type) => (
                      <Badge key={type} variant="secondary" className="text-xs">
                        {type}
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
