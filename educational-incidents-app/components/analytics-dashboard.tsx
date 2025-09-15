"use client"

import { useState } from "react"
import type { IncidentData, Filters } from "@/lib/types"
import { useTimeSeries, useStateAggregations } from "@/lib/hooks/use-incidents"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from "recharts"
import { TrendingUp, TrendingDown, Users, AlertTriangle, MapPin } from "lucide-react"

interface AnalyticsDashboardProps {
  incidents: IncidentData[]
  filters?: Filters
}

export function AnalyticsDashboard({ incidents, filters }: AnalyticsDashboardProps) {
  const [selectedTimeframe, setSelectedTimeframe] = useState<"month" | "quarter" | "year">("month")

  const { data: timeSeriesData, isLoading: timeSeriesLoading } = useTimeSeries(filters)
  const { data: stateAggData, isLoading: stateAggLoading } = useStateAggregations(filters)

  // Process data for charts
  const processTemporalData = () => {
    if (timeSeriesData) {
      return timeSeriesData.map((point) => ({
        month: point.period,
        incidents: point.incidents,
        affected: point.killed + point.injured,
        killed: point.killed,
        injured: point.injured,
      }))
    }

    // Fallback to client-side processing if API data not available
    const monthlyData = incidents.reduce(
      (acc, incident) => {
        const date = new Date(incident.date)
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`

        if (!acc[monthKey]) {
          acc[monthKey] = {
            month: monthKey,
            incidents: 0,
            affected: 0,
            critical: 0,
            high: 0,
            medium: 0,
            low: 0,
          }
        }

        acc[monthKey].incidents += 1
        acc[monthKey].affected += incident.affectedCount
        acc[monthKey][incident.severity as keyof (typeof acc)[typeof monthKey]] += 1

        return acc
      },
      {} as Record<string, any>,
    )

    return Object.values(monthlyData).sort((a: any, b: any) => a.month.localeCompare(b.month))
  }

  const processSeverityData = () => {
    const severityCount = incidents.reduce(
      (acc, incident) => {
        acc[incident.severity] = (acc[incident.severity] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    return [
      { name: "Bajo", value: severityCount.low || 0, color: "#10b981" },
      { name: "Medio", value: severityCount.medium || 0, color: "#f59e0b" },
      { name: "Alto", value: severityCount.high || 0, color: "#f97316" },
      { name: "Crítico", value: severityCount.critical || 0, color: "#ef4444" },
    ]
  }

  const processStateData = () => {
    if (stateAggData) {
      return stateAggData.slice(0, 10).map((state) => ({
        state: state.state,
        incidents: state.incidents,
        affected: state.killed + state.injured,
        killed: state.killed,
        injured: state.injured,
      }))
    }

    // Fallback to client-side processing
    const stateData = incidents.reduce(
      (acc, incident) => {
        if (!acc[incident.state]) {
          acc[incident.state] = {
            state: incident.state,
            incidents: 0,
            affected: 0,
          }
        }
        acc[incident.state].incidents += 1
        acc[incident.state].affected += incident.affectedCount
        return acc
      },
      {} as Record<string, any>,
    )

    return Object.values(stateData)
      .sort((a: any, b: any) => b.incidents - a.incidents)
      .slice(0, 10)
  }

  const processInstitutionTypeData = () => {
    const typeData = incidents.reduce(
      (acc, incident) => {
        const typeLabels = {
          elementary: "Primaria",
          middle: "Secundaria",
          high: "Preparatoria",
          university: "Universidad",
        }

        const label = typeLabels[incident.institutionType as keyof typeof typeLabels] || incident.institutionType

        if (!acc[label]) {
          acc[label] = {
            type: label,
            incidents: 0,
            affected: 0,
          }
        }
        acc[label].incidents += 1
        acc[label].affected += incident.affectedCount
        return acc
      },
      {} as Record<string, any>,
    )

    return Object.values(typeData)
  }

  const temporalData = processTemporalData()
  const severityData = processSeverityData()
  const stateData = processStateData()
  const institutionTypeData = processInstitutionTypeData()

  // Calculate key metrics
  const totalIncidents = incidents.length
  const totalAffected = incidents.reduce((sum, incident) => sum + incident.affectedCount, 0)
  const criticalIncidents = incidents.filter((i) => i.severity === "critical").length
  const averageAffected = totalIncidents > 0 ? Math.round(totalAffected / totalIncidents) : 0

  // Calculate trends (comparing last 2 months)
  const lastTwoMonths = temporalData.slice(-2)
  const incidentTrend =
    lastTwoMonths.length === 2
      ? ((lastTwoMonths[1].incidents - lastTwoMonths[0].incidents) / lastTwoMonths[0].incidents) * 100
      : 0

  if (timeSeriesLoading || stateAggLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-muted rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-muted rounded w-full"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse">
              <div className="h-64 bg-muted rounded"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Incidentes</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalIncidents}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {incidentTrend > 0 ? (
                <TrendingUp className="w-3 h-3 mr-1 text-red-500" />
              ) : (
                <TrendingDown className="w-3 h-3 mr-1 text-green-500" />
              )}
              {Math.abs(incidentTrend).toFixed(1)}% vs mes anterior
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Personas Afectadas</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAffected.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Promedio: {averageAffected} por incidente</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Incidentes Críticos</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{criticalIncidents}</div>
            <p className="text-xs text-muted-foreground">
              {totalIncidents > 0 ? ((criticalIncidents / totalIncidents) * 100).toFixed(1) : 0}% del total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estados Afectados</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stateData.length}</div>
            <p className="text-xs text-muted-foreground">Con incidentes registrados</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="temporal" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="temporal">Tendencias Temporales</TabsTrigger>
          <TabsTrigger value="severity">Por Severidad</TabsTrigger>
          <TabsTrigger value="geographic">Por Estado</TabsTrigger>
          <TabsTrigger value="institutional">Por Institución</TabsTrigger>
        </TabsList>

        <TabsContent value="temporal" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Incidentes por Mes</CardTitle>
                <CardDescription>Evolución temporal del número de incidentes</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={temporalData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => {
                        const [year, month] = value.split("-")
                        return `${month}/${year.slice(-2)}`
                      }}
                    />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip
                      labelFormatter={(value) => {
                        const [year, month] = value.split("-")
                        return `${month}/${year}`
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="incidents"
                      stroke="hsl(var(--primary))"
                      fill="hsl(var(--primary))"
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Personas Afectadas por Mes</CardTitle>
                <CardDescription>Total de personas afectadas mensualmente</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={temporalData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => {
                        const [year, month] = value.split("-")
                        return `${month}/${year.slice(-2)}`
                      }}
                    />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip
                      labelFormatter={(value) => {
                        const [year, month] = value.split("-")
                        return `${month}/${year}`
                      }}
                    />
                    <Line type="monotone" dataKey="affected" stroke="hsl(var(--chart-2))" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="severity" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Distribución por Severidad</CardTitle>
                <CardDescription>Proporción de incidentes según nivel de severidad</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={severityData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {severityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Severidad por Mes</CardTitle>
                <CardDescription>Evolución de la severidad de incidentes</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={temporalData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => {
                        const [year, month] = value.split("-")
                        return `${month}/${year.slice(-2)}`
                      }}
                    />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="critical" stackId="a" fill="#ef4444" />
                    <Bar dataKey="high" stackId="a" fill="#f97316" />
                    <Bar dataKey="medium" stackId="a" fill="#f59e0b" />
                    <Bar dataKey="low" stackId="a" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="geographic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top 10 Estados con Más Incidentes</CardTitle>
              <CardDescription>Estados con mayor número de incidentes registrados</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={stateData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" tick={{ fontSize: 12 }} />
                  <YAxis dataKey="state" type="category" tick={{ fontSize: 12 }} width={80} />
                  <Tooltip />
                  <Bar dataKey="incidents" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="institutional" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Incidentes por Tipo de Institución</CardTitle>
                <CardDescription>Distribución según el nivel educativo</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={institutionTypeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="type" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="incidents" fill="hsl(var(--chart-3))" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Personas Afectadas por Tipo</CardTitle>
                <CardDescription>Total de afectados según tipo de institución</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={institutionTypeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="type" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="affected" fill="hsl(var(--chart-4))" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Patrón Temporal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Mes con más incidentes:</span>
                <Badge variant="outline">
                  {temporalData.length > 0
                    ? temporalData.reduce((max, current) => (current.incidents > max.incidents ? current : max)).month
                    : "N/A"}
                </Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tendencia actual:</span>
                <Badge variant={incidentTrend > 0 ? "destructive" : "default"}>
                  {incidentTrend > 0 ? "Aumentando" : "Disminuyendo"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Severidad Dominante</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {severityData
                .sort((a, b) => b.value - a.value)
                .slice(0, 2)
                .map((item, index) => (
                  <div key={item.name} className="flex justify-between text-sm">
                    <span>{index === 0 ? "Más común:" : "Segunda:"}</span>
                    <Badge style={{ backgroundColor: item.color, color: "white" }} className="text-xs">
                      {item.name} ({item.value})
                    </Badge>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Impacto Geográfico</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Estado más afectado:</span>
                <Badge variant="outline">{stateData.length > 0 ? stateData[0].state : "N/A"}</Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span>Concentración:</span>
                <Badge variant="secondary">
                  {stateData.length > 0 ? `${((stateData[0].incidents / totalIncidents) * 100).toFixed(1)}%` : "N/A"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
