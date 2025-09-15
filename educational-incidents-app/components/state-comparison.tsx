"use client"

import { useState, useMemo } from "react"
import type { IncidentData } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
} from "recharts"
import { ArrowUpDown, Calendar, MapPin, RotateCcw } from "lucide-react"

interface StateComparisonProps {
  incidents: IncidentData[]
}

export function StateComparison({ incidents }: StateComparisonProps) {
  const [selectedStates, setSelectedStates] = useState<string[]>([])
  const [comparisonType, setComparisonType] = useState<"states" | "periods">("states")
  const [selectedPeriods, setSelectedPeriods] = useState<string[]>([])

  // Get unique states and periods
  const uniqueStates = [...new Set(incidents.map((i) => i.state))].sort()
  const uniquePeriods = [
    ...new Set(
      incidents.map((i) => {
        const date = new Date(i.date)
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
      }),
    ),
  ].sort()

  // Process data for state comparison
  const processStateData = () => {
    if (selectedStates.length === 0) return []

    return selectedStates.map((state) => {
      const stateIncidents = incidents.filter((i) => i.state === state)
      const severityCount = stateIncidents.reduce(
        (acc, incident) => {
          acc[incident.severity] = (acc[incident.severity] || 0) + 1
          return acc
        },
        {} as Record<string, number>,
      )

      const institutionTypeCount = stateIncidents.reduce(
        (acc, incident) => {
          acc[incident.institutionType] = (acc[incident.institutionType] || 0) + 1
          return acc
        },
        {} as Record<string, number>,
      )

      const totalKilled = stateIncidents.reduce((sum, i) => sum + (i.csvData?.killed || 0), 0)
      const totalInjured = stateIncidents.reduce((sum, i) => sum + (i.csvData?.injured || 0), 0)
      const withResourceOfficer = stateIncidents.filter((i) => i.csvData?.resource_officer).length

      return {
        state,
        totalIncidents: stateIncidents.length,
        totalAffected: stateIncidents.reduce((sum, i) => sum + i.affectedCount, 0),
        totalKilled,
        totalInjured,
        withResourceOfficer,
        resourceOfficerRate: stateIncidents.length > 0 ? (withResourceOfficer / stateIncidents.length) * 100 : 0,
        averageAffected:
          stateIncidents.length > 0
            ? Math.round(stateIncidents.reduce((sum, i) => sum + i.affectedCount, 0) / stateIncidents.length)
            : 0,
        critical: severityCount.critical || 0,
        high: severityCount.high || 0,
        medium: severityCount.medium || 0,
        low: severityCount.low || 0,
        elementary: institutionTypeCount.elementary || 0,
        middle: institutionTypeCount.middle || 0,
        highSchool: institutionTypeCount.high || 0,
        university: institutionTypeCount.university || 0,
        criticalRate: stateIncidents.length > 0 ? ((severityCount.critical || 0) / stateIncidents.length) * 100 : 0,
        highRate: stateIncidents.length > 0 ? ((severityCount.high || 0) / stateIncidents.length) * 100 : 0,
      }
    })
  }

  // Process data for period comparison
  const processPeriodData = () => {
    if (selectedPeriods.length === 0) return []

    return selectedPeriods.map((period) => {
      const periodIncidents = incidents.filter((i) => {
        const date = new Date(i.date)
        const incidentPeriod = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
        return incidentPeriod === period
      })

      const severityCount = periodIncidents.reduce(
        (acc, incident) => {
          acc[incident.severity] = (acc[incident.severity] || 0) + 1
          return acc
        },
        {} as Record<string, number>,
      )

      return {
        period,
        totalIncidents: periodIncidents.length,
        totalAffected: periodIncidents.reduce((sum, i) => sum + i.affectedCount, 0),
        averageAffected:
          periodIncidents.length > 0
            ? Math.round(periodIncidents.reduce((sum, i) => sum + i.affectedCount, 0) / periodIncidents.length)
            : 0,
        critical: severityCount.critical || 0,
        high: severityCount.high || 0,
        medium: severityCount.medium || 0,
        low: severityCount.low || 0,
        criticalRate: periodIncidents.length > 0 ? ((severityCount.critical || 0) / periodIncidents.length) * 100 : 0,
      }
    })
  }

  const stateData = processStateData()
  const periodData = processPeriodData()

  // Radar chart data for state comparison
  const radarData = useMemo(() => {
    if (comparisonType === "states" && stateData.length > 0) {
      const metrics = ["totalIncidents", "totalAffected", "criticalRate", "highRate"]
      const maxValues = metrics.reduce(
        (acc, metric) => {
          acc[metric] = Math.max(...stateData.map((d) => d[metric as keyof typeof d] as number))
          return acc
        },
        {} as Record<string, number>,
      )

      return [
        {
          metric: "Total Incidentes",
          ...stateData.reduce(
            (acc, state) => {
              acc[state.state] =
                maxValues.totalIncidents > 0 ? (state.totalIncidents / maxValues.totalIncidents) * 100 : 0
              return acc
            },
            {} as Record<string, number>,
          ),
        },
        {
          metric: "Total Afectados",
          ...stateData.reduce(
            (acc, state) => {
              acc[state.state] = maxValues.totalAffected > 0 ? (state.totalAffected / maxValues.totalAffected) * 100 : 0
              return acc
            },
            {} as Record<string, number>,
          ),
        },
        {
          metric: "% Críticos",
          ...stateData.reduce(
            (acc, state) => {
              acc[state.state] = state.criticalRate
              return acc
            },
            {} as Record<string, number>,
          ),
        },
        {
          metric: "% Altos",
          ...stateData.reduce(
            (acc, state) => {
              acc[state.state] = state.highRate
              return acc
            },
            {} as Record<string, number>,
          ),
        },
      ]
    }
    return []
  }, [stateData, comparisonType])

  const handleStateToggle = (state: string) => {
    setSelectedStates((prev) =>
      prev.includes(state) ? prev.filter((s) => s !== state) : prev.length < 4 ? [...prev, state] : prev,
    )
  }

  const handlePeriodToggle = (period: string) => {
    setSelectedPeriods((prev) =>
      prev.includes(period) ? prev.filter((p) => p !== period) : prev.length < 4 ? [...prev, period] : prev,
    )
  }

  const resetSelection = () => {
    setSelectedStates([])
    setSelectedPeriods([])
  }

  const formatPeriod = (period: string) => {
    const [year, month] = period.split("-")
    const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]
    return `${monthNames[Number.parseInt(month) - 1]} ${year}`
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Comparación de Datos</CardTitle>
          <CardDescription>Compara incidentes entre estados o períodos de tiempo</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <Select
              value={comparisonType}
              onValueChange={(value: "states" | "periods") => {
                setComparisonType(value)
                resetSelection()
              }}
            >
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="states">Comparar Estados</SelectItem>
                <SelectItem value="periods">Comparar Períodos</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={resetSelection}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Limpiar Selección
            </Button>
          </div>

          {comparisonType === "states" ? (
            <div>
              <div className="text-sm font-medium mb-2">Seleccionar Estados (máximo 4):</div>
              <div className="flex flex-wrap gap-2">
                {uniqueStates.map((state) => (
                  <Button
                    key={state}
                    variant={selectedStates.includes(state) ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleStateToggle(state)}
                    disabled={!selectedStates.includes(state) && selectedStates.length >= 4}
                  >
                    {state}
                  </Button>
                ))}
              </div>
              {selectedStates.length > 0 && (
                <div className="mt-2">
                  <div className="text-xs text-muted-foreground">Estados seleccionados:</div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedStates.map((state) => (
                      <Badge key={state} variant="secondary">
                        {state}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div>
              <div className="text-sm font-medium mb-2">Seleccionar Períodos (máximo 4):</div>
              <div className="flex flex-wrap gap-2">
                {uniquePeriods.slice(-12).map((period) => (
                  <Button
                    key={period}
                    variant={selectedPeriods.includes(period) ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePeriodToggle(period)}
                    disabled={!selectedPeriods.includes(period) && selectedPeriods.length >= 4}
                  >
                    {formatPeriod(period)}
                  </Button>
                ))}
              </div>
              {selectedPeriods.length > 0 && (
                <div className="mt-2">
                  <div className="text-xs text-muted-foreground">Períodos seleccionados:</div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedPeriods.map((period) => (
                      <Badge key={period} variant="secondary">
                        {formatPeriod(period)}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Comparison Results */}
      {((comparisonType === "states" && selectedStates.length > 0) ||
        (comparisonType === "periods" && selectedPeriods.length > 0)) && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {comparisonType === "states"
              ? stateData.map((state) => (
                  <Card key={state.state}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {state.state}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <div className="text-xs text-muted-foreground">Incidentes</div>
                          <div className="font-semibold">{state.totalIncidents}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Afectados</div>
                          <div className="font-semibold">{state.totalAffected}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Críticos</div>
                          <div className="font-semibold text-red-600">{state.critical}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Promedio</div>
                          <div className="font-semibold">{state.averageAffected}</div>
                        </div>
                      </div>
                      {(state.totalKilled > 0 || state.totalInjured > 0) && (
                        <div className="grid grid-cols-2 gap-2 text-sm pt-2 border-t">
                          <div>
                            <div className="text-xs text-muted-foreground">Fallecidos</div>
                            <div className="font-semibold text-red-700">{state.totalKilled}</div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground">Heridos</div>
                            <div className="font-semibold text-orange-600">{state.totalInjured}</div>
                          </div>
                        </div>
                      )}
                      <div className="flex flex-col gap-1">
                        <Badge variant="destructive" className="text-xs">
                          {state.criticalRate.toFixed(1)}% críticos
                        </Badge>
                        {state.resourceOfficerRate > 0 && (
                          <Badge variant="secondary" className="text-xs">
                            {state.resourceOfficerRate.toFixed(1)}% con oficial
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              : periodData.map((period) => (
                  <Card key={period.period}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {formatPeriod(period.period)}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <div className="text-xs text-muted-foreground">Incidentes</div>
                          <div className="font-semibold">{period.totalIncidents}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Afectados</div>
                          <div className="font-semibold">{period.totalAffected}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Críticos</div>
                          <div className="font-semibold text-red-600">{period.critical}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Promedio</div>
                          <div className="font-semibold">{period.averageAffected}</div>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Badge variant="destructive" className="text-xs">
                          {period.criticalRate.toFixed(1)}% críticos
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Bar Chart */}
            <Card>
              <CardHeader>
                <CardTitle>
                  {comparisonType === "states" ? "Incidentes por Estado" : "Incidentes por Período"}
                </CardTitle>
                <CardDescription>Comparación del número total de incidentes</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={comparisonType === "states" ? stateData : periodData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey={comparisonType === "states" ? "state" : "period"}
                      tick={{ fontSize: 12 }}
                      tickFormatter={comparisonType === "periods" ? formatPeriod : undefined}
                    />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip labelFormatter={comparisonType === "periods" ? formatPeriod : undefined} />
                    <Bar dataKey="totalIncidents" fill="hsl(var(--primary))" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Severity Comparison */}
            <Card>
              <CardHeader>
                <CardTitle>Comparación por Severidad</CardTitle>
                <CardDescription>Distribución de incidentes según nivel de severidad</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={comparisonType === "states" ? stateData : periodData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey={comparisonType === "states" ? "state" : "period"}
                      tick={{ fontSize: 12 }}
                      tickFormatter={comparisonType === "periods" ? formatPeriod : undefined}
                    />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip labelFormatter={comparisonType === "periods" ? formatPeriod : undefined} />
                    <Bar dataKey="critical" stackId="a" fill="#ef4444" />
                    <Bar dataKey="high" stackId="a" fill="#f97316" />
                    <Bar dataKey="medium" stackId="a" fill="#f59e0b" />
                    <Bar dataKey="low" stackId="a" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Affected People Comparison */}
            <Card>
              <CardHeader>
                <CardTitle>Personas Afectadas</CardTitle>
                <CardDescription>
                  Total de personas afectadas en cada {comparisonType === "states" ? "estado" : "período"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={comparisonType === "states" ? stateData : periodData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey={comparisonType === "states" ? "state" : "period"}
                      tick={{ fontSize: 12 }}
                      tickFormatter={comparisonType === "periods" ? formatPeriod : undefined}
                    />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip labelFormatter={comparisonType === "periods" ? formatPeriod : undefined} />
                    <Bar dataKey="totalAffected" fill="hsl(var(--chart-2))" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Radar Chart for States */}
            {comparisonType === "states" && radarData.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Análisis Multidimensional</CardTitle>
                  <CardDescription>Comparación de múltiples métricas entre estados</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart data={radarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11 }} />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} />
                      {selectedStates.map((state, index) => (
                        <Radar
                          key={state}
                          name={state}
                          dataKey={state}
                          stroke={`hsl(${index * 90}, 70%, 50%)`}
                          fill={`hsl(${index * 90}, 70%, 50%)`}
                          fillOpacity={0.1}
                          strokeWidth={2}
                        />
                      ))}
                      <Legend />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Institution Type Comparison for States */}
          {comparisonType === "states" && (
            <Card>
              <CardHeader>
                <CardTitle>Distribución por Tipo de Institución</CardTitle>
                <CardDescription>Comparación de incidentes según el tipo de institución educativa</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={stateData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="state" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="elementary" name="Primaria" fill="hsl(var(--chart-1))" />
                    <Bar dataKey="middle" name="Secundaria" fill="hsl(var(--chart-2))" />
                    <Bar dataKey="highSchool" name="Preparatoria" fill="hsl(var(--chart-3))" />
                    <Bar dataKey="university" name="Universidad" fill="hsl(var(--chart-4))" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* Empty State */}
      {((comparisonType === "states" && selectedStates.length === 0) ||
        (comparisonType === "periods" && selectedPeriods.length === 0)) && (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="text-muted-foreground">
              <ArrowUpDown className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">
                Selecciona {comparisonType === "states" ? "estados" : "períodos"} para comparar
              </h3>
              <p className="text-sm">
                Elige hasta 4 {comparisonType === "states" ? "estados" : "períodos"} para ver gráficas comparativas y
                análisis detallado
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
