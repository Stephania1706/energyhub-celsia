"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { MapPin, Loader2, Map } from "lucide-react";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";

// Cargar el componente de mapa dinámicamente para evitar problemas de SSR
const MapComponent = dynamic(() => import("@/components/ui/map-component"), {
  ssr: false,
});

interface LocationResult {
  display_name: string;
  lat: string;
  lon: string;
  place_id: number;
}

interface StartJourneyFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (data: {
    nombre: string;
    contractId: string;
    ubicacion: {
      address: string;
      lat: number;
      lng: number;
    };
  }) => void;
}

export function StartJourneyForm({
  open,
  onOpenChange,
  onSubmit,
}: StartJourneyFormProps) {
  const [nombre, setNombre] = useState("");
  const [contractId, setContractId] = useState("CTR-2024-001234");
  const [locationQuery, setLocationQuery] = useState("");
  const [locationResults, setLocationResults] = useState<LocationResult[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<LocationResult | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [mapCenter, setMapCenter] = useState<[number, number]>([4.6097, -74.0817]); // Bogotá por defecto
  const [mapMarker, setMapMarker] = useState<{ position: [number, number]; popup?: string } | null>(null);
  const [errors, setErrors] = useState<{
    nombre?: string;
    contractId?: string;
    ubicacion?: string;
  }>({});
  
  const searchTimeoutRef = useRef<NodeJS.Timeout>();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Buscar ubicaciones cuando el usuario escribe
  useEffect(() => {
    if (locationQuery.trim().length < 3) {
      setLocationResults([]);
      setShowDropdown(false);
      setIsSearching(false);
      return;
    }

    // Limpiar timeout anterior
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
      setIsSearching(false);
    }

    // Esperar 500ms después de que el usuario deje de escribir
    searchTimeoutRef.current = setTimeout(async () => {
      setIsSearching(true);
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            locationQuery
          )}&limit=5&addressdetails=1`,
          {
            headers: {
              "User-Agent": "EnergyHub/1.0",
            },
          }
        );

        if (response.ok) {
          const data: LocationResult[] = await response.json();
          setLocationResults(data);
          // Mostrar dropdown automáticamente si hay resultados y el input tiene focus
          if (data.length > 0 && document.activeElement === inputRef.current) {
            setShowDropdown(true);
          }
        } else {
          setLocationResults([]);
          setShowDropdown(false);
        }
      } catch (error) {
        console.error("Error buscando ubicación:", error);
        setLocationResults([]);
        setShowDropdown(false);
      } finally {
        setIsSearching(false);
      }
    }, 500);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
      setIsSearching(false);
    };
  }, [locationQuery]);

  // Mostrar dropdown automáticamente cuando hay resultados y el input tiene focus
  useEffect(() => {
    if (locationResults.length > 0 && !isSearching && document.activeElement === inputRef.current) {
      setShowDropdown(true);
    }
  }, [locationResults, isSearching]);

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Limpiar formulario cuando se cierra el modal
  useEffect(() => {
    if (!open) {
      setNombre("");
      setContractId("CTR-2024-001234");
      setLocationQuery("");
      setSelectedLocation(null);
      setLocationResults([]);
      setShowDropdown(false);
      setShowMap(false);
      setMapMarker(null);
      setErrors({});
    }
  }, [open]);

  // Manejar clic en el mapa
  const handleMapClick = async (latlng: { lat: number; lng: number }) => {
    try {
      // Hacer reverse geocoding para obtener la dirección
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latlng.lat}&lon=${latlng.lng}&addressdetails=1`,
        {
          headers: {
            "User-Agent": "EnergyHub/1.0",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        const location: LocationResult = {
          display_name: data.display_name || `${latlng.lat}, ${latlng.lng}`,
          lat: latlng.lat.toString(),
          lon: latlng.lng.toString(),
          place_id: data.place_id || Date.now(),
        };
        
        setSelectedLocation(location);
        setLocationQuery(location.display_name);
        setMapMarker({
          position: [latlng.lat, latlng.lng],
          popup: location.display_name,
        });
        setShowMap(false);
        setErrors((prev) => ({ ...prev, ubicacion: undefined }));
      }
    } catch (error) {
      console.error("Error obteniendo dirección:", error);
      // Si falla, usar coordenadas
      const location: LocationResult = {
        display_name: `${latlng.lat.toFixed(6)}, ${latlng.lng.toFixed(6)}`,
        lat: latlng.lat.toString(),
        lon: latlng.lng.toString(),
        place_id: Date.now(),
      };
      setSelectedLocation(location);
      setLocationQuery(location.display_name);
      setMapMarker({
        position: [latlng.lat, latlng.lng],
        popup: location.display_name,
      });
      setShowMap(false);
    }
  };

  const handleLocationSelect = (location: LocationResult) => {
    setSelectedLocation(location);
    setLocationQuery(location.display_name);
    setShowDropdown(false);
    setLocationResults([]);
    setMapMarker({
      position: [parseFloat(location.lat), parseFloat(location.lon)],
      popup: location.display_name,
    });
    setErrors((prev) => ({ ...prev, ubicacion: undefined }));
    // Quitar focus del input
    inputRef.current?.blur();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: typeof errors = {};
    
    if (!nombre.trim()) {
      newErrors.nombre = "El nombre es requerido";
    }
    
    if (!selectedLocation) {
      newErrors.ubicacion = "Debes seleccionar una ubicación válida";
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    if (onSubmit && selectedLocation) {
      onSubmit({
        nombre: nombre.trim(),
        contractId: contractId.trim(),
        ubicacion: {
          address: selectedLocation.display_name,
          lat: parseFloat(selectedLocation.lat),
          lng: parseFloat(selectedLocation.lon),
        },
      });
      
      // Cerrar el modal después de enviar
      onOpenChange(false);
    }
  };

  const handleGuestStart = () => {
    // Demo user data with default values
    const demoData = {
      nombre: "Usuario Demo",
      contractId: "CTR-2024-001234",
      ubicacion: {
        address: "Bogotá, Colombia",
        lat: 4.6097,
        lng: -74.0817,
      },
    };
    
    if (onSubmit) {
      onSubmit(demoData);
      // Cerrar el modal después de enviar
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Inicia Tu Viaje</DialogTitle>
          <DialogDescription>
            Completa el formulario para comenzar tu experiencia en el Centro de Energía Celsia
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Campo Nombre */}
          <div className="space-y-2">
            <Label htmlFor="nombre">
              Nombre <span className="text-destructive">*</span>
            </Label>
            <Input
              id="nombre"
              value={nombre}
              onChange={(e) => {
                setNombre(e.target.value);
                setErrors((prev) => ({ ...prev, nombre: undefined }));
              }}
              placeholder="Ingresa tu nombre completo"
              className={cn(errors.nombre && "border-destructive")}
            />
            {errors.nombre && (
              <p className="text-sm text-destructive">{errors.nombre}</p>
            )}
          </div>

          {/* Campo ID del Contrato */}
          <div className="space-y-2">
            <Label htmlFor="contractId">
              ID del Contrato
            </Label>
            <Input
              id="contractId"
              value={contractId}
              onChange={(e) => {
                setContractId(e.target.value);
              }}
              placeholder="Ingresa el ID de tu contrato"
            />
          </div>

          {/* Campo Ubicación con búsqueda */}
          <div className="space-y-2">
            <Label htmlFor="ubicacion">
              Ubicación <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  ref={inputRef}
                  id="ubicacion"
                  value={locationQuery}
                  onChange={(e) => {
                    const newValue = e.target.value;
                    setLocationQuery(newValue);
                    // Solo limpiar selección si el usuario está escribiendo algo diferente
                    if (selectedLocation && newValue !== selectedLocation.display_name) {
                      setSelectedLocation(null);
                      setMapMarker(null);
                    }
                    // No cerrar dropdown inmediatamente, se cerrará si no hay resultados
                    if (newValue.trim().length < 3) {
                      setShowDropdown(false);
                    }
                    setErrors((prev) => ({ ...prev, ubicacion: undefined }));
                  }}
                  onFocus={() => {
                    if (locationResults.length > 0 && !isSearching) {
                      setShowDropdown(true);
                    }
                  }}
                  onBlur={(e) => {
                    // Solo cerrar si el siguiente elemento no es parte del dropdown
                    setTimeout(() => {
                      if (
                        !dropdownRef.current?.contains(document.activeElement) &&
                        document.activeElement !== inputRef.current
                      ) {
                        setShowDropdown(false);
                      }
                    }, 200);
                  }}
                  placeholder="Busca una dirección o haz clic en el mapa"
                  className={cn(
                    "pl-9 pr-20",
                    errors.ubicacion && "border-destructive"
                  )}
                />
                {isSearching && locationQuery.trim().length >= 3 && (
                  <Loader2 className="absolute right-12 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground animate-spin" />
                )}
                <button
                  type="button"
                  onClick={() => {
                    setShowMap(!showMap);
                    setShowDropdown(false);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-md hover:bg-accent transition-colors"
                  title="Buscar en el mapa"
                >
                  <Map className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>
              
              {/* Dropdown de resultados */}
              {showDropdown && locationResults.length > 0 && (
                <div
                  ref={dropdownRef}
                  className="absolute z-50 w-full mt-1 bg-background border border-border rounded-md shadow-lg max-h-60 overflow-auto"
                >
                  {locationResults.map((result) => (
                    <button
                      key={result.place_id}
                      type="button"
                      onClick={() => handleLocationSelect(result)}
                      className="w-full text-left px-4 py-2 hover:bg-accent transition-colors border-b border-border last:border-b-0"
                    >
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-foreground line-clamp-2">
                          {result.display_name}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Mapa interactivo */}
            {showMap && (
              <div className="mt-2 border border-border rounded-md overflow-hidden">
                <div className="h-64 w-full">
                  <MapComponent
                    center={selectedLocation ? [parseFloat(selectedLocation.lat), parseFloat(selectedLocation.lon)] : mapCenter}
                    zoom={selectedLocation ? 15 : 10}
                    markers={mapMarker ? [mapMarker] : []}
                    onMapClick={handleMapClick}
                  />
                </div>
                <div className="p-2 bg-muted/50 text-xs text-muted-foreground text-center">
                  Haz clic en el mapa para seleccionar una ubicación
                </div>
              </div>
            )}
            
            {errors.ubicacion && (
              <p className="text-sm text-destructive">{errors.ubicacion}</p>
            )}
            {selectedLocation && (
              <p className="text-xs text-muted-foreground">
                Ubicación seleccionada: {selectedLocation.display_name}
              </p>
            )}
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={handleGuestStart}
              className="w-full sm:w-auto order-2 sm:order-1"
            >
              Continuar como Invitado
            </Button>
            <div className="flex gap-2 w-full sm:w-auto order-1 sm:order-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1 sm:flex-none"
              >
                Cancelar
              </Button>
              <Button type="submit" className="flex-1 sm:flex-none">
                Continuar
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

