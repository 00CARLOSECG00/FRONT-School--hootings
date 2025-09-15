"use client"

import { useState } from "react"
import { MapView } from "@/components/map-view"
import { FilterSidebar } from "@/components/filter-sidebar"
import { IncidentDetailPanel } from "@/components/incident-detail-panel"
import { AnalyticsDashboard } from "@/components/analytics-dashboard"
import { DataTable } from "@/components/data-table"
import { StateComparison } from "@/components/state-comparison"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, ArrowLeft, Map, BarChart3, Table, GitCompare } from "lucide-react"
import Link from "next/link"

export interface IncidentData {
  id: string
  date: string
  institutionName: string
  city: string
  state: string
  affectedCount: number
  latitude: number
  longitude: number
  source: string
  institutionType: "elementary" | "middle" | "high" | "university"
  severity: "low" | "medium" | "high" | "critical"
  description?: string
}

// Mock data for demonstration
const mockIncidents: IncidentData[] = [
  {
    id: "1",
    date: "2024-01-15",
    institutionName: "Lincoln Elementary School",
    city: "Springfield",
    state: "Illinois",
    affectedCount: 12,
    latitude: 39.7817,
    longitude: -89.6501,
    source: "Local News Report",
    institutionType: "elementary",
    severity: "medium",
    description: "Security incident during school hours",
  },
  {
    id: "2",
    date: "2024-02-03",
    institutionName: "Roosevelt High School",
    city: "Chicago",
    state: "Illinois",
    affectedCount: 25,
    latitude: 41.8781,
    longitude: -87.6298,
    source: "Police Report",
    institutionType: "high",
    severity: "high",
    description: "Safety protocol activation",
  },
  {
    id: "3",
    date: "2024-01-28",
    institutionName: "University of California",
    city: "Los Angeles",
    state: "California",
    affectedCount: 8,
    latitude: 34.0522,
    longitude: -118.2437,
    source: "University Security",
    institutionType: "university",
    severity: "low",
    description: "Campus security incident",
  },
  {
    id: "4",
    date: "2024-03-10",
    institutionName: "Washington Middle School",
    city: "Austin",
    state: "Texas",
    affectedCount: 45,
    latitude: 30.2672,
    longitude: -97.7431,
    source: "School District Report",
    institutionType: "middle",
    severity: "critical",
    description: "Emergency response activated",
  },
  {
    id: "5",
    date: "2024-02-20",
    institutionName: "Jefferson Elementary",
    city: "Miami",
    state: "Florida",
    affectedCount: 18,
    latitude: 25.7617,
    longitude: -80.1918,
    source: "Local Authorities",
    institutionType: "elementary",
    severity: "medium",
    description: "Safety incident reported",
  },
]

export default function DashboardPage() {
  const [selectedIncident, setSelectedIncident] = useState<IncidentData | null>(null)
  const [filteredIncidents, setFilteredIncidents] = useState<IncidentData[]>(mockIncidents)
  const [mapMode, setMapMode] = useState<"markers" | "heatmap">("markers")
  const [activeTab, setActiveTab] = useState<"map" | "analytics" | "table" | "comparison">("map")

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm z-50">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Inicio
              </Link>
            </Button>
            <h1 className="text-lg font-semibold">Dashboard de Análisis</h1>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2">
              <Button
                variant={activeTab === "map" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveTab("map")}
              >
                <Map className="w-4 h-4 mr-2" />
                Mapa
              </Button>
              <Button
                variant={activeTab === "analytics" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveTab("analytics")}
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Análisis
              </Button>
              <Button
                variant={activeTab === "table" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveTab("table")}
              >
                <Table className="w-4 h-4 mr-2" />
                Tabla
              </Button>
              <Button
                variant={activeTab === "comparison" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveTab("comparison")}
              >
                <GitCompare className="w-4 h-4 mr-2" />
                Comparar
              </Button>
            </div>

            {activeTab === "map" && (
              <div className="hidden sm:flex items-center gap-2">
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
            )}

            <ThemeToggle />

            {/* Mobile menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="md:hidden bg-transparent">
                  <Menu className="w-4 h-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80">
                <FilterSidebar incidents={mockIncidents} onFilterChange={setFilteredIncidents} />
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar - only show for map and analytics views */}
        {(activeTab === "map" || activeTab === "analytics") && (
          <aside className="hidden md:block w-80 border-r bg-card/50">
            <FilterSidebar incidents={mockIncidents} onFilterChange={setFilteredIncidents} />
          </aside>
        )}

        <main className="flex-1 relative">
          {activeTab === "map" ? (
            <MapView
              incidents={filteredIncidents}
              mode={mapMode}
              onIncidentSelect={setSelectedIncident}
              selectedIncident={selectedIncident}
            />
          ) : activeTab === "analytics" ? (
            <div className="h-full overflow-y-auto p-6">
              <AnalyticsDashboard incidents={filteredIncidents} />
            </div>
          ) : activeTab === "table" ? (
            <div className="h-full overflow-y-auto p-6">
              <DataTable incidents={filteredIncidents} onIncidentSelect={setSelectedIncident} />
            </div>
          ) : (
            <div className="h-full overflow-y-auto p-6">
              <StateComparison incidents={filteredIncidents} />
            </div>
          )}
        </main>

        {selectedIncident && (activeTab === "map" || activeTab === "table") && (
          <aside className="w-80 border-l bg-card/50">
            <IncidentDetailPanel incident={selectedIncident} onClose={() => setSelectedIncident(null)} />
          </aside>
        )}
      </div>
    </div>
  )
}
