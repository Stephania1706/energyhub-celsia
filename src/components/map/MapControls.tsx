import { useState, useCallback } from 'react';
import { MapLayers } from './MapLayers.js';
import type { MapLayer } from './MapLayers.js';
import { MapLegend, alertTypeConfig } from './MapLegend';
import { AlertType } from '@/types/map';
import { Button } from '../ui/button';
import { Layers, Filter, X, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Checkbox } from '../ui/checkbox';

interface MapControlsProps {
  className?: string;
  activeFilters?: AlertType[];
  onFilterChange?: (type: AlertType, checked: boolean) => void;
  onLayerChange?: (layers: MapLayer[]) => void;
  onRefresh?: () => void;
  lastUpdated?: string;
}

export function MapControls({
  className,
  activeFilters = [],
  onFilterChange,
  onLayerChange,
  onRefresh,
  lastUpdated,
}: MapControlsProps) {
  const [showLayers, setShowLayers] = useState(false);
  const [showLegend, setShowLegend] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const toggleLayers = useCallback(() => {
    setShowLayers(prev => !prev);
    setShowFilters(false);
  }, []);

  const toggleFilters = useCallback(() => {
    setShowFilters(prev => !prev);
    setShowLayers(false);
  }, []);

  const toggleLegend = useCallback(() => {
    setShowLegend(prev => !prev);
  }, []);

  return (
    <div className={cn('fixed z-10 flex flex-col gap-2', className)}>
      {/* Main Controls */}
      <div className="flex flex-col gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={toggleLayers}
          className={cn(
            'w-10 h-10 rounded-full shadow-md',
            showLayers && 'bg-accent text-accent-foreground'
          )}
        >
          <Layers className="w-5 h-5" />
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          onClick={toggleFilters}
          className={cn(
            'w-10 h-10 rounded-full shadow-md',
            showFilters && 'bg-accent text-accent-foreground'
          )}
        >
          <Filter className="w-5 h-5" />
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          onClick={onRefresh}
          className="w-10 h-10 rounded-full shadow-md"
          title="Actualizar datos"
        >
          <RefreshCw className="w-5 h-5" />
        </Button>
      </div>

      {/* Layers Panel */}
      {showLayers && (
        <div className="bg-background/95 backdrop-blur-sm border rounded-lg p-4 shadow-lg w-64">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-sm">Capas del Mapa</h3>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={toggleLayers}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <MapLayers onChange={onLayerChange} />
        </div>
      )}

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-background/95 backdrop-blur-sm border rounded-lg p-4 shadow-lg w-64">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-sm">Filtros</h3>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={toggleFilters}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <div className="space-y-2">
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">
                Tipo de Evento
              </label>
              <div className="space-y-2">
                {Object.entries(alertTypeConfig).map(([type, config]) => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox
                      id={`filter-${type}`}
                      checked={activeFilters.includes(type as AlertType)}
                      onCheckedChange={(checked: boolean) => 
                        onFilterChange?.(type as AlertType, checked)
                      }
                    />
                    <label
                      htmlFor={`filter-${type}`}
                      className="text-sm font-medium leading-none cursor-pointer flex items-center gap-2"
                    >
                      <div className={`w-3 h-3 rounded-full ${config.color}`} />
                      {config.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Legend */}
      {showLegend && (
        <MapLegend 
          className="w-64"
          activeFilters={activeFilters}
          onFilterChange={onFilterChange}
        />
      )}

      {/* Last Updated */}
      {lastUpdated && (
        <div className="text-xs text-muted-foreground bg-background/80 backdrop-blur-sm px-2 py-1 rounded-md border">
          Actualizado: {lastUpdated}
        </div>
      )}
    </div>
  );
}
