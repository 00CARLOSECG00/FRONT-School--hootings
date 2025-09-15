"use client"

import { useState, useMemo } from "react"
import type { IncidentData } from "@/app/dashboard/page"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, ArrowUpDown, ArrowUp, ArrowDown, FileText, FileSpreadsheet, Eye, ExternalLink } from "lucide-react"

interface DataTableProps {
  incidents: IncidentData[]
  onIncidentSelect?: (incident: IncidentData) => void
}

type SortField = keyof IncidentData
type SortDirection = "asc" | "desc"

export function DataTable({ incidents, onIncidentSelect }: DataTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState<SortField>("date")
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")
  const [pageSize, setPageSize] = useState(25)
  const [currentPage, setCurrentPage] = useState(1)

  // Filter and sort data
  const filteredAndSortedData = useMemo(() => {
    const filtered = incidents.filter(
      (incident) =>
        incident.institutionName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        incident.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        incident.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
        incident.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
        incident.description?.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    filtered.sort((a, b) => {
      let aValue = a[sortField]
      let bValue = b[sortField]

      // Handle different data types
      if (sortField === "date") {
        aValue = new Date(a.date).getTime()
        bValue = new Date(b.date).getTime()
      } else if (typeof aValue === "string" && typeof bValue === "string") {
        aValue = aValue.toLowerCase()
        bValue = bValue.toLowerCase()
      }

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
      return 0
    })

    return filtered
  }, [incidents, searchTerm, sortField, sortDirection])

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedData.length / pageSize)
  const paginatedData = filteredAndSortedData.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
    setCurrentPage(1)
  }

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
      elementary: "Primaria",
      middle: "Secundaria",
      high: "Preparatoria",
      university: "Universidad",
    }
    return labels[type as keyof typeof labels] || type
  }

  const exportToCSV = () => {
    const headers = [
      "ID",
      "Fecha",
      "Institución",
      "Ciudad",
      "Estado",
      "Tipo de Institución",
      "Severidad",
      "Personas Afectadas",
      "Latitud",
      "Longitud",
      "Fuente",
      "Descripción",
    ]

    const csvContent = [
      headers.join(","),
      ...filteredAndSortedData.map((incident) =>
        [
          incident.id,
          incident.date,
          `"${incident.institutionName}"`,
          incident.city,
          incident.state,
          getInstitutionTypeLabel(incident.institutionType),
          getSeverityLabel(incident.severity),
          incident.affectedCount,
          incident.latitude,
          incident.longitude,
          `"${incident.source}"`,
          `"${incident.description || ""}"`,
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `incidentes_educativos_${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const exportToJSON = () => {
    const jsonContent = JSON.stringify(filteredAndSortedData, null, 2)
    const blob = new Blob([jsonContent], { type: "application/json;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `incidentes_educativos_${new Date().toISOString().split("T")[0]}.json`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
    }
    return sortDirection === "asc" ? (
      <ArrowUp className="w-4 h-4 text-primary" />
    ) : (
      <ArrowDown className="w-4 h-4 text-primary" />
    )
  }

  return (
    <div className="space-y-4">
      {/* Controls */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Tabla de Datos de Incidentes</CardTitle>
              <CardDescription>
                {filteredAndSortedData.length} de {incidents.length} incidentes mostrados
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button onClick={exportToCSV} variant="outline" size="sm">
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                Exportar CSV
              </Button>
              <Button onClick={exportToJSON} variant="outline" size="sm">
                <FileText className="w-4 h-4 mr-2" />
                Exportar JSON
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por institución, ciudad, estado, fuente o descripción..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setCurrentPage(1)
                }}
                className="pl-10"
              />
            </div>
            <Select
              value={pageSize.toString()}
              onValueChange={(value) => {
                setPageSize(Number(value))
                setCurrentPage(1)
              }}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10 filas</SelectItem>
                <SelectItem value="25">25 filas</SelectItem>
                <SelectItem value="50">50 filas</SelectItem>
                <SelectItem value="100">100 filas</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Button variant="ghost" size="sm" onClick={() => handleSort("id")} className="h-8 p-0 font-medium">
                      ID
                      <SortIcon field="id" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort("date")}
                      className="h-8 p-0 font-medium"
                    >
                      Fecha
                      <SortIcon field="date" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort("institutionName")}
                      className="h-8 p-0 font-medium"
                    >
                      Institución
                      <SortIcon field="institutionName" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort("city")}
                      className="h-8 p-0 font-medium"
                    >
                      Ubicación
                      <SortIcon field="city" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort("institutionType")}
                      className="h-8 p-0 font-medium"
                    >
                      Tipo
                      <SortIcon field="institutionType" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort("severity")}
                      className="h-8 p-0 font-medium"
                    >
                      Severidad
                      <SortIcon field="severity" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort("affectedCount")}
                      className="h-8 p-0 font-medium"
                    >
                      Afectados
                      <SortIcon field="affectedCount" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort("source")}
                      className="h-8 p-0 font-medium"
                    >
                      Fuente
                      <SortIcon field="source" />
                    </Button>
                  </TableHead>
                  <TableHead className="w-20">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.map((incident) => (
                  <TableRow key={incident.id} className="hover:bg-muted/50">
                    <TableCell className="font-mono text-xs">{incident.id}</TableCell>
                    <TableCell className="text-sm">{new Date(incident.date).toLocaleDateString("es-ES")}</TableCell>
                    <TableCell>
                      <div className="max-w-48">
                        <div className="font-medium text-sm truncate" title={incident.institutionName}>
                          {incident.institutionName}
                        </div>
                        {incident.description && (
                          <div className="text-xs text-muted-foreground truncate" title={incident.description}>
                            {incident.description}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      <div>{incident.city}</div>
                      <div className="text-xs text-muted-foreground">{incident.state}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {getInstitutionTypeLabel(incident.institutionType)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getSeverityColor(incident.severity)} text-xs`}>
                        {getSeverityLabel(incident.severity)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm font-medium">{incident.affectedCount}</TableCell>
                    <TableCell className="text-sm">
                      <div className="max-w-32 truncate" title={incident.source}>
                        {incident.source}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {onIncidentSelect && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onIncidentSelect(incident)}
                            className="h-8 w-8 p-0"
                            title="Ver detalles"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        )}
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Ver fuente">
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <Card>
          <CardContent className="py-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-muted-foreground">
                Mostrando {(currentPage - 1) * pageSize + 1} a{" "}
                {Math.min(currentPage * pageSize, filteredAndSortedData.length)} de {filteredAndSortedData.length}{" "}
                resultados
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  Anterior
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum
                    if (totalPages <= 5) {
                      pageNum = i + 1
                    } else if (currentPage <= 3) {
                      pageNum = i + 1
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i
                    } else {
                      pageNum = currentPage - 2 + i
                    }

                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(pageNum)}
                        className="w-8 h-8 p-0"
                      >
                        {pageNum}
                      </Button>
                    )
                  })}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  Siguiente
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
