"use client"

import { useState } from "react"
import { AlertTriangle, Shield, Users, Calendar, MapPin, BarChart3, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ReportIncidentModal } from "@/components/report-incident-modal"
import Link from "next/link"

export default function HomePage() {
  const [hasAcceptedWarning, setHasAcceptedWarning] = useState(false)

  if (!hasAcceptedWarning) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-destructive" />
            </div>
            <CardTitle className="text-2xl font-bold text-balance">Contenido Sensible - Advertencia</CardTitle>
            <CardDescription className="text-lg text-pretty">
              Esta aplicación contiene información sobre incidentes sensibles en instituciones educativas
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertTitle>Aviso Importante</AlertTitle>
              <AlertDescription className="text-pretty">
                Los datos presentados en esta plataforma incluyen información sobre incidentes de seguridad en
                instituciones educativas de Estados Unidos. El contenido puede ser perturbador y está destinado
                únicamente para fines educativos, de investigación y análisis de políticas públicas.
              </AlertDescription>
            </Alert>

            <div className="space-y-3">
              <h3 className="font-semibold">Esta plataforma es para:</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                  Educadores y administradores escolares
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                  Investigadores en seguridad educativa
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                  Responsables de políticas públicas
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                  Personal de seguridad escolar
                </li>
              </ul>
            </div>

            <div className="pt-4 border-t">
              <Button onClick={() => setHasAcceptedWarning(true)} className="w-full" size="lg">
                Entiendo y deseo continuar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold">SafetyScope</h1>
                <p className="text-sm text-muted-foreground">Plataforma de Análisis de Seguridad Educativa</p>
              </div>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/dashboard" className="text-sm font-medium hover:text-primary transition-colors">
                Dashboard
              </Link>
              <ReportIncidentModal>
                <Button variant="ghost" size="sm" className="text-sm font-medium">
                  <Plus className="w-4 h-4 mr-1" />
                  Reportar
                </Button>
              </ReportIncidentModal>
              <Link href="/resources" className="text-sm font-medium hover:text-primary transition-colors">
                Recursos
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-balance">Visualización Interactiva de Incidentes Educativos</h2>
          <p className="text-xl text-muted-foreground mb-8 text-pretty max-w-3xl mx-auto">
            Herramienta profesional para el análisis y visualización de datos de seguridad en instituciones educativas
            de Estados Unidos
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/dashboard">
                <BarChart3 className="w-5 h-5 mr-2" />
                Explorar Dashboard
              </Link>
            </Button>
            <ReportIncidentModal>
              <Button variant="outline" size="lg">
                <Plus className="w-5 h-5 mr-2" />
                Reportar Incidente
              </Button>
            </ReportIncidentModal>
          </div>
        </section>

        {/* Key Metrics */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Incidentes</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2,847</div>
              <p className="text-xs text-muted-foreground">Registrados en la base de datos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Instituciones Afectadas</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,523</div>
              <p className="text-xs text-muted-foreground">Escuelas y universidades</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Estados Cubiertos</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">50</div>
              <p className="text-xs text-muted-foreground">Todos los estados de EE.UU.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Período de Datos</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2020-2024</div>
              <p className="text-xs text-muted-foreground">Últimos 4 años</p>
            </CardContent>
          </Card>
        </section>

        {/* Features */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Mapas Interactivos</CardTitle>
              <CardDescription>
                Visualización geográfica con clustering y modo heatmap para identificar patrones espaciales
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Análisis Temporal</CardTitle>
              <CardDescription>
                Gráficas de tendencias y comparaciones estadísticas para entender la evolución temporal
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Filtros Avanzados</CardTitle>
              <CardDescription>
                Sistema de filtrado por fechas, ubicación, tipo de institución y nivel de severidad
              </CardDescription>
            </CardHeader>
          </Card>
        </section>

        {/* Call to Action */}
        <section className="text-center bg-muted/50 rounded-lg p-8">
          <h3 className="text-2xl font-bold mb-4">¿Listo para explorar los datos?</h3>
          <p className="text-muted-foreground mb-6 text-pretty">
            Accede al dashboard completo para comenzar tu análisis de datos de seguridad educativa
          </p>
          <Button asChild size="lg">
            <Link href="/dashboard">Ir al Dashboard</Link>
          </Button>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-card/50 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-5 h-5 text-primary" />
                <span className="font-semibold">SafetyScope</span>
              </div>
              <p className="text-sm text-muted-foreground text-pretty">
                Plataforma profesional para el análisis de datos de seguridad educativa
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Recursos</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/resources" className="hover:text-primary transition-colors">
                    Recursos de Apoyo
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-primary transition-colors">
                    Acerca de
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contacto</h4>
              <p className="text-sm text-muted-foreground">
                Para consultas sobre los datos o la metodología, contacta al equipo de investigación.
              </p>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>© 2024 SafetyScope. Desarrollado para fines educativos y de investigación.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
