"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, MapPin, School, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ReportIncidentModalProps {
  children: React.ReactNode
}

export function ReportIncidentModal({ children }: ReportIncidentModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    state: "",
    city: "",
    institutionName: "",
    institutionType: "",
    severity: "",
    category: "",
    reporterName: "",
    reporterEmail: "",
    reporterRole: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simular envío del reporte
    await new Promise((resolve) => setTimeout(resolve, 2000))

    console.log("[v0] Nuevo incidente reportado:", formData)

    // Reset form
    setFormData({
      title: "",
      description: "",
      date: "",
      location: "",
      state: "",
      city: "",
      institutionName: "",
      institutionType: "",
      severity: "",
      category: "",
      reporterName: "",
      reporterEmail: "",
      reporterRole: "",
    })

    setIsSubmitting(false)
    setIsOpen(false)

    // Mostrar confirmación (en una implementación real, esto sería un toast)
    alert("Reporte enviado exitosamente. Será revisado por nuestro equipo.")
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-primary" />
            Reportar Nuevo Incidente
          </DialogTitle>
          <DialogDescription>
            Complete el formulario para reportar un nuevo incidente de seguridad educativa. Toda la información será
            revisada antes de ser incluida en la base de datos.
          </DialogDescription>
        </DialogHeader>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Este formulario es para reportar incidentes reales. La información falsa o malintencionada será rechazada y
            puede tener consecuencias legales.
          </AlertDescription>
        </Alert>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Información del Incidente */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Información del Incidente
                </CardTitle>
                <CardDescription>Detalles básicos sobre el incidente reportado</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Título del Incidente *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="Breve descripción del incidente"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Descripción Detallada *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Proporcione una descripción detallada del incidente..."
                    rows={4}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="date">Fecha del Incidente *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange("date", e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="category">Categoría del Incidente *</Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione una categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="violence">Violencia</SelectItem>
                      <SelectItem value="threat">Amenaza</SelectItem>
                      <SelectItem value="weapon">Arma</SelectItem>
                      <SelectItem value="bullying">Acoso/Bullying</SelectItem>
                      <SelectItem value="substance">Sustancias</SelectItem>
                      <SelectItem value="security">Seguridad</SelectItem>
                      <SelectItem value="other">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="severity">Nivel de Severidad *</Label>
                  <Select value={formData.severity} onValueChange={(value) => handleInputChange("severity", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione el nivel" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Bajo</SelectItem>
                      <SelectItem value="medium">Medio</SelectItem>
                      <SelectItem value="high">Alto</SelectItem>
                      <SelectItem value="critical">Crítico</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Información de Ubicación e Institución */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Ubicación e Institución
                </CardTitle>
                <CardDescription>Información sobre dónde ocurrió el incidente</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="institutionName">Nombre de la Institución *</Label>
                  <Input
                    id="institutionName"
                    value={formData.institutionName}
                    onChange={(e) => handleInputChange("institutionName", e.target.value)}
                    placeholder="Nombre completo de la escuela/universidad"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="institutionType">Tipo de Institución *</Label>
                  <Select
                    value={formData.institutionType}
                    onValueChange={(value) => handleInputChange("institutionType", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione el tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="elementary">Escuela Primaria</SelectItem>
                      <SelectItem value="middle">Escuela Intermedia</SelectItem>
                      <SelectItem value="high">Escuela Secundaria</SelectItem>
                      <SelectItem value="university">Universidad</SelectItem>
                      <SelectItem value="community-college">Community College</SelectItem>
                      <SelectItem value="private">Escuela Privada</SelectItem>
                      <SelectItem value="charter">Charter School</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="state">Estado *</Label>
                  <Select value={formData.state} onValueChange={(value) => handleInputChange("state", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione el estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AL">Alabama</SelectItem>
                      <SelectItem value="CA">California</SelectItem>
                      <SelectItem value="FL">Florida</SelectItem>
                      <SelectItem value="NY">New York</SelectItem>
                      <SelectItem value="TX">Texas</SelectItem>
                      {/* En una implementación real, incluiría todos los estados */}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="city">Ciudad *</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    placeholder="Ciudad donde ocurrió el incidente"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="location">Ubicación Específica</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    placeholder="Ej: Cafetería, Aula 205, Patio, etc."
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Información del Reportero */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <School className="w-4 h-4" />
                Información del Reportero
              </CardTitle>
              <CardDescription>Sus datos de contacto (mantenidos confidenciales)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="reporterName">Nombre Completo *</Label>
                  <Input
                    id="reporterName"
                    value={formData.reporterName}
                    onChange={(e) => handleInputChange("reporterName", e.target.value)}
                    placeholder="Su nombre completo"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="reporterEmail">Email de Contacto *</Label>
                  <Input
                    id="reporterEmail"
                    type="email"
                    value={formData.reporterEmail}
                    onChange={(e) => handleInputChange("reporterEmail", e.target.value)}
                    placeholder="su.email@ejemplo.com"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="reporterRole">Su Rol *</Label>
                  <Select
                    value={formData.reporterRole}
                    onValueChange={(value) => handleInputChange("reporterRole", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione su rol" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="teacher">Maestro/Profesor</SelectItem>
                      <SelectItem value="administrator">Administrador</SelectItem>
                      <SelectItem value="security">Personal de Seguridad</SelectItem>
                      <SelectItem value="student">Estudiante</SelectItem>
                      <SelectItem value="parent">Padre/Madre</SelectItem>
                      <SelectItem value="staff">Personal de la Institución</SelectItem>
                      <SelectItem value="witness">Testigo</SelectItem>
                      <SelectItem value="other">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Enviando..." : "Enviar Reporte"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
