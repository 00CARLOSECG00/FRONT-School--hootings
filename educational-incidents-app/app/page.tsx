"use client"

import { useState } from "react"
import { AlertTriangle, Shield, Users, Calendar, MapPin, BarChart3, Plus, Skull, Target, Eye } from "lucide-react"
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
        <Card className="max-w-2xl w-full border-destructive/20 shadow-2xl">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-20 h-20 bg-destructive/20 rounded-full flex items-center justify-center">
              <Skull className="w-10 h-10 text-destructive" />
            </div>
            <CardTitle className="text-3xl font-bold text-balance text-destructive">ADVERTENCIA CRÍTICA</CardTitle>
            <CardDescription className="text-lg text-pretty font-medium">
              Contenido extremadamente sensible sobre violencia escolar
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert className="border-destructive/50 bg-destructive/5">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <AlertTitle className="text-destructive font-bold text-foreground">DATOS REALES DE TRAGEDIAS</AlertTitle>
              <AlertDescription className="text-pretty font-medium text-foreground">
                Esta plataforma contiene información detallada sobre incidentes violentos reales en escuelas de Estados
                Unidos, incluyendo datos sobre víctimas fatales, heridos, perpetradores y circunstancias. El contenido
                puede ser profundamente perturbador y está destinado únicamente para investigación seria y análisis de
                políticas de seguridad.
              </AlertDescription>
            </Alert>

            <div className="bg-muted/50 p-4 rounded-lg border">
              <h3 className="font-bold text-destructive mb-3">MAGNITUD DEL PROBLEMA:</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold text-destructive">2,847</div>
                  <div className="text-muted-foreground">Incidentes documentados</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-destructive">1,523</div>
                  <div className="text-muted-foreground">Escuelas afectadas</div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-destructive">ACCESO RESTRINGIDO PARA:</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-destructive" />
                  Investigadores en criminología y seguridad
                </li>
                <li className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-destructive" />
                  Autoridades de seguridad pública
                </li>
                <li className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-destructive" />
                  Analistas de políticas educativas
                </li>
                <li className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-destructive" />
                  Personal especializado en prevención
                </li>
              </ul>
            </div>

            <div className="pt-4 border-t border-destructive/20">
              <Button
                onClick={() => setHasAcceptedWarning(true)}
                className="w-full bg-destructive hover:bg-destructive/90"
                size="lg"
              >
                <Eye className="w-4 h-4 mr-2" />
                ACEPTO LA RESPONSABILIDAD Y CONTINÚO
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
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-destructive rounded-lg flex items-center justify-center">
                <Skull className="w-6 h-6 text-destructive-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Educational Incidents Tracker</h1>
                <p className="text-sm text-muted-foreground">Plataforma de Investigación Forense</p>
              </div>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/dashboard" className="text-sm font-medium hover:text-destructive transition-colors">
                Dashboard
              </Link>
              <ReportIncidentModal>
                <Button variant="ghost" size="sm" className="text-sm font-medium hover:text-destructive">
                  <Plus className="w-4 h-4 mr-1" />
                  Reportar Caso
                </Button>
              </ReportIncidentModal>
              <Link href="/resources" className="text-sm font-medium hover:text-destructive transition-colors">
                Recursos
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="text-center mb-12 bg-gradient-to-b from-destructive/5 to-transparent p-8 rounded-lg">
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 bg-destructive/10 px-4 py-2 rounded-full text-sm font-medium text-destructive mb-4">
              <AlertTriangle className="w-4 h-4" />
              INVESTIGACIÓN ACTIVA
            </div>
          </div>
          <h2 className="text-5xl font-bold mb-6 text-balance">
            LA REALIDAD OCULTA DE LA
            <span className="text-destructive"> VIOLENCIA ESCOLAR</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-8 text-pretty max-w-4xl mx-auto font-medium">
            Análisis forense profundo de 2,847 incidentes violentos documentados en instituciones educativas
            estadounidenses. Datos reales, patrones ocultos, verdades incómodas.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-destructive hover:bg-destructive/90">
              <Link href="/dashboard">
                <Eye className="w-5 h-5 mr-2" />
                EXPLORAR LOS DATOS
              </Link>
            </Button>
            <ReportIncidentModal>
              <Button
                variant="outline"
                size="lg"
                className="border-destructive/50 hover:bg-destructive/10 bg-transparent"
              >
                <Plus className="w-5 h-5 mr-2" />
                Reportar Nuevo Caso
              </Button>
            </ReportIncidentModal>
          </div>
        </section>

        {/* Shocking Statistics */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="border-destructive/20 bg-destructive/5">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-destructive">VÍCTIMAS FATALES</CardTitle>
              <Skull className="h-5 w-5 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-destructive">1,247</div>
              <p className="text-xs text-muted-foreground">Muertes documentadas</p>
            </CardContent>
          </Card>

          <Card className="border-destructive/20 bg-destructive/5">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-destructive">HERIDOS GRAVES</CardTitle>
              <Target className="h-5 w-5 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-destructive">3,891</div>
              <p className="text-xs text-muted-foreground">Lesiones reportadas</p>
            </CardContent>
          </Card>

          <Card className="border-destructive/20 bg-destructive/5">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-destructive">PERPETRADORES</CardTitle>
              <Users className="h-5 w-5 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-destructive">2,156</div>
              <p className="text-xs text-muted-foreground">Agresores identificados</p>
            </CardContent>
          </Card>

          <Card className="border-destructive/20 bg-destructive/5">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-destructive">FRECUENCIA</CardTitle>
              <Calendar className="h-5 w-5 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-destructive">1.9</div>
              <p className="text-xs text-muted-foreground">Incidentes por día</p>
            </CardContent>
          </Card>
        </section>

        {/* Dark Features */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <Card className="border-destructive/20">
            <CardHeader>
              <div className="w-12 h-12 bg-destructive/20 rounded-lg flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6 text-destructive" />
              </div>
              <CardTitle className="text-destructive">MAPEO FORENSE</CardTitle>
              <CardDescription>
                Geolocalización exacta de cada tragedia. Identifica zonas de alto riesgo y patrones geográficos ocultos.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-destructive/20">
            <CardHeader>
              <div className="w-12 h-12 bg-destructive/20 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-destructive" />
              </div>
              <CardTitle className="text-destructive">PERFILES CRIMINALES</CardTitle>
              <CardDescription>
                Análisis demográfico de perpetradores: edad, raza, género, relación con la víctima y métodos utilizados.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-destructive/20">
            <CardHeader>
              <div className="w-12 h-12 bg-destructive/20 rounded-lg flex items-center justify-center mb-4">
                <Eye className="w-6 h-6 text-destructive" />
              </div>
              <CardTitle className="text-destructive">DATOS CLASIFICADOS</CardTitle>
              <CardDescription>
                Información detallada sobre armas, seguridad escolar, y factores socioeconómicos que otros no muestran.
              </CardDescription>
            </CardHeader>
          </Card>
        </section>

        {/* Call to Action */}
        <section className="text-center bg-destructive/10 border border-destructive/20 rounded-lg p-8">
          <h3 className="text-3xl font-bold mb-4 text-destructive">¿PREPARADO PARA LA VERDAD?</h3>
          <p className="text-muted-foreground mb-6 text-pretty font-medium">
            Accede a la base de datos más completa y perturbadora sobre violencia escolar en Estados Unidos. Descubre
            patrones que las autoridades prefieren ocultar.
          </p>
          <Button asChild size="lg" className="bg-destructive hover:bg-destructive/90">
            <Link href="/dashboard">
              <Eye className="w-5 h-5 mr-2" />
              ENTRAR AL SISTEMA
            </Link>
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
