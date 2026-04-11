"use client";

import { MapPin, Clock, AlertTriangle, Phone, Users, Navigation } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

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

// City coordinates for Valle del Cauca
const cityCoordinates = {
  cali: { lat: 3.4516, lng: -76.5320, name: "Cali" },
  palmira: { lat: 3.5394, lng: -76.3036, name: "Palmira" },
  yumbo: { lat: 3.5833, lng: -76.5000, name: "Yumbo" },
  valle: { lat: 3.5, lng: -76.4, name: "Valle del Cauca" } // Centered on Valle del Cauca
};

interface MapComponentProps {
  selectedMunicipality?: string;
  selectedType?: string;
}

export default function MapComponent({ selectedMunicipality = "todos", selectedType = "todos" }: MapComponentProps) {
  const [selectedOutage, setSelectedOutage] = useState<Outage | null>(null);
  const [selectedCity, setSelectedCity] = useState<string>("valle");
  const [mapUrl, setMapUrl] = useState<string>("https://www.openstreetmap.org/export/embed.html?bbox=-77.2%2C3.1%2C-75.8%2C3.8&layer=mapnik&marker=3.5,-76.4");

  // Filter outages based on props
  const filteredOutages = mockOutages.filter((outage) => {
    const municipalityMatch = selectedMunicipality === "todos" || outage.municipality === selectedMunicipality;
    const typeMatch = selectedType === "todos" || outage.type === selectedType;
    return municipalityMatch && typeMatch;
  });

  const handleCityChange = (city: string) => {
    setSelectedCity(city);
    const coords = cityCoordinates[city as keyof typeof cityCoordinates];
    if (coords) {
      // Update map URL to center on selected city with different zoom levels
      let bbox;
      if (city === "valle") {
        // Full Valle del Cauca view - better centered
        bbox = "-77.2,3.1,-75.8,3.8";
      } else {
        // Closer view for individual cities
        bbox = `${coords.lng - 0.05},${coords.lat - 0.05},${coords.lng + 0.05},${coords.lat + 0.05}`;
      }
      const newUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${coords.lat},${coords.lng}`;
      setMapUrl(newUrl);
    }
  };

  return (
    <div className="space-y-4">
      {/* City Selector */}
      <div className="flex items-center gap-3">
        <Navigation className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium text-foreground">Centrar en:</span>
        <Select value={selectedCity} onValueChange={handleCityChange}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Seleccionar ciudad" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="valle">Valle del Cauca (Vista General)</SelectItem>
            <SelectItem value="cali">Cali</SelectItem>
            <SelectItem value="palmira">Palmira</SelectItem>
            <SelectItem value="yumbo">Yumbo</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Map Container */}
      <div className="h-[500px] w-full relative bg-white dark:bg-background [data-theme='celsia']:bg-[hsl(var(--background))] rounded-lg overflow-hidden border border-[hsl(var(--border))]">
        {/* Embedded OpenStreetMap */}
        <iframe
          key={selectedCity} // Force reload when city changes
          src={mapUrl}
          className="w-full h-full"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Mapa de Valle del Cauca"
        />
      
      {/* Overlay markers */}
      <div className="absolute inset-0 pointer-events-none">
        {filteredOutages.map((outage, index) => (
          <div
            key={outage.id}
            className="absolute animate-pulse pointer-events-auto cursor-pointer"
            style={{
              left: `${20 + index * 15}%`,
              top: `${30 + (index % 2) * 25}%`,
            }}
            onClick={() => setSelectedOutage(outage)}
          >
            <div className={`w-6 h-6 rounded-full ${
              outage.type === "imprevisto" ? "bg-red-500" : "bg-orange-500"
            } shadow-lg flex items-center justify-center`}>
              <MapPin className="h-4 w-4 text-white" />
            </div>
            <div className={`w-10 h-10 rounded-full ${
              outage.type === "imprevisto" ? "bg-red-500/30" : "bg-orange-500/30"
            } absolute -top-2 -left-2 animate-ping`} />
          </div>
        ))}
      </div>

      {/* Selected outage popup */}
      {selectedOutage && (
        <div className="absolute top-4 right-4 bg-background border border-border rounded-lg shadow-lg p-4 max-w-sm z-10">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-sm">{selectedOutage.municipality} - {selectedOutage.zone}</h3>
              <Badge
                variant={selectedOutage.type === "imprevisto" ? "destructive" : "default"}
                className="text-xs"
              >
                {selectedOutage.type === "imprevisto" ? "Imprevisto" : "Programado"}
              </Badge>
            </div>
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={() => setSelectedOutage(null)}
              className="h-6 w-6 p-0"
            >
              ✕
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mb-2">{selectedOutage.cause}</p>
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>Inicio: {selectedOutage.startTime}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              <span>{selectedOutage.affectedUsers.toLocaleString()} usuarios</span>
            </div>
            <div className="flex items-center gap-1">
              <Phone className="h-3 w-3" />
              <span>{selectedOutage.operatorPhone}</span>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
