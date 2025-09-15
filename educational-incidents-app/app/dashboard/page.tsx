"use client"

import { useState, useMemo } from "react"
import { convertToDisplayFormat, type IncidentData, type Filters } from "@/lib/types"
import { useIncidents } from "@/lib/hooks/use-incidents"
import { MapView } from "@/components/map-view"
import { FilterSidebar } from "@/components/filter-sidebar"
import { IncidentDetailPanel } from "@/components/incident-detail-panel"
import { AnalyticsDashboard } from "@/components/analytics-dashboard"
import { DataTable } from "@/components/data-table"
import { StateComparison } from "@/components/state-comparison"
import { ReportIncidentModal } from "@/components/report-incident-modal"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Map, BarChart3, Table, Filter, Plus, AlertTriangle, Users, MapPin, TrendingUp, GitCompare } from "lucide-react"

export default function DashboardPage() {
  const [selectedIncident, setSelectedIncident] = useState<IncidentData | null>(null)
  const [mapMode, setMapMode] = useState<"markers" | "heatmap">("markers")
  const [filters, setFilters] = useState<Filters>({})

  const { data: rawIncidents, error, isLoading } = useIncidents(filters)

  const incidents = useMemo(() => {
    if (!rawIncidents) return []
    return rawIncidents.map(convertToDisplayFormat)
  }, [rawIncidents])

  // Calculate summary statistics
  const totalIncidents = incidents.length
  const totalAffected = incidents.reduce((sum, incident) => sum + incident.affectedCount, 0)
  const criticalIncidents = incidents.filter((i) => i.severity === "critical").length
  const uniqueStates = new Set(incidents.map((i) => i.state)).size

  // Recent incidents (last 30 days)
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  const recentIncidents = incidents.filter((i) => new Date(i.date) >= thirtyDaysAgo).length

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando datos de incidentes...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Error al cargar datos</h2>
          <p className="text-muted-foreground">{error instanceof Error ? error.message : "Error desconocido"}</p>
          <p className="text-xs text-muted-foreground mt-2">
            Verifica que el backend esté ejecutándose en {process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Mapa de Incidentes Educativos</h1>
              <p className="text-muted-foreground">
                Análisis y visualización de incidentes de seguridad en instituciones educativas
              </p>
            </div>
            <div className="flex items-center gap-4">
              <ReportIncidentModal>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Reportar Incidente
                </Button>
              </ReportIncidentModal>
            </div>
          </div>
        </div>
      </header>

      {/* Summary Stats */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Incidentes</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalIncidents.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Registrados en la base de datos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Personas Afectadas</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalAffected.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Total de víctimas</p>
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
              <div className="text-2xl font-bold">{uniqueStates}</div>
              <p className="text-xs text-muted-foreground">Con incidentes registrados</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Últimos 30 días</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{recentIncidents}</div>
              <p className="text-xs text-muted-foreground">Incidentes recientes</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="h-fit">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Filtros
                </CardTitle>
                <CardDescription>{incidents.length} incidentes mostrados</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <FilterSidebar filters={filters} onFiltersChange={setFilters} />
              </CardContent>
            </Card>
          </div>

          {/* Main Panel */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="map" className="space-y-4">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="map" className="flex items-center gap-2">
                  <Map className="w-4 h-4" />
                  Mapa
                </TabsTrigger>
                <TabsTrigger value="analytics" className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Análisis
                </TabsTrigger>
                <TabsTrigger value="table" className="flex items-center gap-2">
                  <Table className="w-4 h-4" />
                  Tabla
                </TabsTrigger>
                <TabsTrigger value="comparison" className="flex items-center gap-2">
                  <GitCompare className="w-4 h-4" />
                  Comparar
                </TabsTrigger>
              </TabsList>

              <TabsContent value="map" className="space-y-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Visualización Geográfica</CardTitle>
                        <CardDescription>
                          Ubicación de incidentes en el mapa. Haz clic en un marcador para ver detalles.
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant={mapMode === "markers" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setMapMode("markers")}
                        >
                          Marcadores
                        </Button>
                        <Button
                          variant={mapMode === "heatmap" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setMapMode("heatmap")}
                        >
                          Mapa de Calor
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="h-[600px] relative">
                      <MapView
                        incidents={incidents}
                        mode={mapMode}
                        onIncidentSelect={setSelectedIncident}
                        selectedIncident={selectedIncident}
                        filters={filters}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="analytics">
                <AnalyticsDashboard incidents={incidents} filters={filters} />
              </TabsContent>

              <TabsContent value="table">
                <DataTable incidents={incidents} onIncidentSelect={setSelectedIncident} />
              </TabsContent>

              <TabsContent value="comparison">
                <StateComparison incidents={incidents} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Incident Detail Panel */}
      {selectedIncident && (
        <div className="fixed inset-y-0 right-0 w-96 bg-background border-l shadow-lg z-50 overflow-hidden">
          <IncidentDetailPanel incident={selectedIncident} onClose={() => setSelectedIncident(null)} />
        </div>
      )}
    </div>
  )
}
