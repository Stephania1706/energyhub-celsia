"use client";

import { MapPin, Clock, AlertTriangle, Phone, Filter, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import InteractiveMap from "./InteractiveMap";

interface Outage {
  id: string;
  municipality: string;
  zone: string;
  type: "programado" | "imprevisto";
  startTime: string;
  estimatedEnd: string;
  cause: string;
  operator: string;
  operatorPhone: string;
  affectedUsers: number;
  status: "activo" | "en_proceso" | "resuelto";
  coordinates: { lat: number; lng: number };
}

const mockOutages: Outage[] = [
  {
    id: "1",
    municipality: "Cali",
    zone: "Norte - Barrio Versalles",
    type: "imprevisto",
    startTime: "14:30",
    estimatedEnd: "18:00",
    cause: "Falla en transformador de distribución",
    operator: "Celsia",
    operatorPhone: "+57 602 8860000",
    affectedUsers: 1250,
    status: "en_proceso",
    coordinates: { lat: 3.4516, lng: -76.5320 },
  },
  {
    id: "2",
    municipality: "Cali",
    zone: "Sur - Ciudad Jardín",
    type: "programado",
    startTime: "08:00",
    estimatedEnd: "12:00",
    cause: "Mantenimiento preventivo de red",
    operator: "Celsia",
    operatorPhone: "+57 602 8860000",
    affectedUsers: 850,
    status: "activo",
    coordinates: { lat: 3.3950, lng: -76.5400 },
  },
  {
    id: "3",
    municipality: "Palmira",
    zone: "Centro",
    type: "imprevisto",
    startTime: "16:15",
    estimatedEnd: "19:30",
    cause: "Daño en línea de media tensión por árbol caído",
    operator: "Celsia",
    operatorPhone: "+57 602 8860000",
    affectedUsers: 620,
    status: "activo",
    coordinates: { lat: 3.5394, lng: -76.3036 },
  },
  {
    id: "4",
    municipality: "Yumbo",
    zone: "Industrial",
    type: "programado",
    startTime: "22:00",
    estimatedEnd: "04:00",
    cause: "Actualización de sistema de protección",
    operator: "Celsia",
    operatorPhone: "+57 602 8860000",
    affectedUsers: 2100,
    status: "activo",
    coordinates: { lat: 3.5833, lng: -76.5000 },
  },
];

export default function PowerOutageMap() {
  const [selectedMunicipality, setSelectedMunicipality] = useState<string>("todos");
  const [selectedType, setSelectedType] = useState<string>("todos");

  const filteredOutages = mockOutages.filter((outage) => {
    const municipalityMatch = selectedMunicipality === "todos" || outage.municipality === selectedMunicipality;
    const typeMatch = selectedType === "todos" || outage.type === selectedType;
    return municipalityMatch && typeMatch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "activo":
        return "bg-red-500";
      case "en_proceso":
        return "bg-yellow-500";
      case "resuelto":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "activo":
        return "Activo";
      case "en_proceso":
        return "En Proceso";
      case "resuelto":
        return "Resuelto";
      default:
        return status;
    }
  };

  return (
    <Card className="bg-card border-border">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-500/10">
              <MapPin className="h-5 w-5 text-red-500" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">Mapa de Cortes de Energía</h2>
              <p className="text-sm text-muted-foreground">Información en tiempo real de interrupciones del servicio</p>
            </div>
          </div>
          <Badge variant="outline" className="gap-1">
            <AlertTriangle className="h-3 w-3" />
            {filteredOutages.length} eventos activos
          </Badge>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Filtros:</span>
          </div>
          <Select value={selectedMunicipality} onValueChange={setSelectedMunicipality}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Municipio" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos los municipios</SelectItem>
              <SelectItem value="Cali">Cali</SelectItem>
              <SelectItem value="Palmira">Palmira</SelectItem>
              <SelectItem value="Yumbo">Yumbo</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Tipo de evento" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos los tipos</SelectItem>
              <SelectItem value="programado">Programado</SelectItem>
              <SelectItem value="imprevisto">Imprevisto</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="p-6">
        {/* Interactive Map */}
        <InteractiveMap 
          selectedMunicipality={selectedMunicipality}
          selectedType={selectedType}
        />

        {/* Outage List */}
        <div className="space-y-4">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            Eventos Activos ({filteredOutages.length})
          </h3>

          {filteredOutages.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">No hay eventos que coincidan con los filtros seleccionados</p>
            </Card>
          ) : (
            filteredOutages.map((outage) => (
              <Card key={outage.id} className="p-4 hover:shadow-md transition-all">
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-foreground">{outage.municipality} - {outage.zone}</h4>
                        <Badge
                          variant={outage.type === "imprevisto" ? "destructive" : "default"}
                          className="text-xs"
                        >
                          {outage.type === "imprevisto" ? "Imprevisto" : "Programado"}
                        </Badge>
                        <div className="flex items-center gap-1">
                          <div className={`w-2 h-2 rounded-full ${getStatusColor(outage.status)}`} />
                          <span className="text-xs text-muted-foreground">{getStatusText(outage.status)}</span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        <strong>Causa:</strong> {outage.cause}
                      </p>
                      <div className="flex flex-wrap gap-4 text-sm">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>Inicio: {outage.startTime}</span>
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>Normalización: {outage.estimatedEnd}</span>
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          <span>{outage.affectedUsers.toLocaleString()} usuarios afectados</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Operador:</span>
                      <span className="font-medium text-foreground">{outage.operator}</span>
                      <span className="text-primary">{outage.operatorPhone}</span>
                    </div>
                    <Button size="sm" variant="outline">
                      Ver Detalles
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Info Card */}
        <Card className="mt-6 p-4 bg-blue-500/5 border-blue-500/20">
          <div className="flex gap-3">
            <MapPin className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-foreground mb-1">Información Importante</h4>
              <p className="text-sm text-muted-foreground">
                Este mapa se actualiza cada 5 minutos con información directa de los operadores de red. 
                Para reportar un corte no listado, contacta a tu operador o usa el botón de reporte en la esquina superior.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </Card>
  );
}
