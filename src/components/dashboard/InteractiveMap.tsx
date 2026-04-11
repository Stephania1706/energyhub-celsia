"use client";

import { MapPin, Clock, AlertTriangle, Phone, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import dynamic from 'next/dynamic';

// Dynamically import the map component to avoid SSR issues
const MapComponent = dynamic(() => import('./MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="h-[500px] w-full flex items-center justify-center bg-muted/20 rounded-lg">
      <div className="text-center">
        <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
        <p className="text-muted-foreground">Cargando mapa...</p>
      </div>
    </div>
  )
});

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

interface InteractiveMapProps {
  selectedMunicipality?: string;
  selectedType?: string;
}

export default function InteractiveMap({ selectedMunicipality = "todos", selectedType = "todos" }: InteractiveMapProps) {
  const [selectedOutage, setSelectedOutage] = useState<Outage | null>(null);

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
    <div className="space-y-6">
      {/* Interactive Map */}
      <Card className="overflow-hidden">
        <MapComponent 
          selectedMunicipality={selectedMunicipality}
          selectedType={selectedType}
        />
      </Card>

      {/* Selected Outage Details */}
      {selectedOutage && (
        <Card className="p-4 bg-blue-500/5 border-blue-500/20">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-foreground">{selectedOutage.municipality} - {selectedOutage.zone}</h3>
              <Badge
                variant={selectedOutage.type === "imprevisto" ? "destructive" : "default"}
                className="text-xs"
              >
                {selectedOutage.type === "imprevisto" ? "Imprevisto" : "Programado"}
              </Badge>
              <div className="flex items-center gap-1">
                <div className={`w-2 h-2 rounded-full ${getStatusColor(selectedOutage.status)}`} />
                <span className="text-xs text-muted-foreground">{getStatusText(selectedOutage.status)}</span>
              </div>
            </div>
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={() => setSelectedOutage(null)}
            >
              ✕
            </Button>
          </div>
          
          <p className="text-sm text-muted-foreground mb-3">
            <strong>Causa:</strong> {selectedOutage.cause}
          </p>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Inicio: {selectedOutage.startTime}</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Normalización: {selectedOutage.estimatedEnd}</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>{selectedOutage.affectedUsers.toLocaleString()} usuarios afectados</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Phone className="h-4 w-4" />
              <span>{selectedOutage.operatorPhone}</span>
            </div>
          </div>
        </Card>
      )}

      {/* Legend */}
      <Card className="p-4">
        <h4 className="font-semibold text-foreground mb-3">Leyenda del Mapa</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-red-500"></div>
            <span>Eventos Imprevistos</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-orange-500"></div>
            <span>Eventos Programados</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500"></div>
            <span>Estado Activo</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
            <span>En Proceso</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
