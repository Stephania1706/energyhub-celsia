import { useState } from 'react';
import { Checkbox } from '../ui/checkbox';
import { AlertType } from '@/types/map';

export interface MapLayer {
  id: string;
  name: string;
  type: AlertType[];
  visible: boolean;
  description?: string;
}

interface MapLayersProps {
  onChange?: (layers: MapLayer[]) => void;
  initialLayers?: MapLayer[];
}

export function MapLayers({ onChange, initialLayers }: MapLayersProps) {
  const [layers, setLayers] = useState<MapLayer[]>(
    initialLayers || [
      {
        id: 'outages',
        name: 'Cortes de Energía',
        type: ['outage', 'emergency'],
        visible: true,
        description: 'Muestra los cortes de energía activos y programados',
      },
      {
        id: 'construction',
        name: 'Construcción',
        type: ['construction'],
        visible: true,
        description: 'Muestra los trabajos de construcción en la red',
      },
      {
        id: 'maintenance',
        name: 'Mantenimiento',
        type: ['maintenance', 'scheduled'],
        visible: true,
        description: 'Muestra los trabajos de mantenimiento programados',
      },
      {
        id: 'cleaning',
        name: 'Limpieza y Protección',
        type: ['cleaning', 'protection'],
        visible: true,
        description: 'Muestra las zonas de limpieza y protección',
      },
      {
        id: 'incidents',
        name: 'Incidentes',
        type: ['incident', 'alert'],
        visible: true,
        description: 'Muestra los incidentes reportados',
      },
    ]
  );

  const handleLayerToggle = (id: string) => {
    const newLayers = layers.map((layer) =>
      layer.id === id ? { ...layer, visible: !layer.visible } : layer
    );
    setLayers(newLayers);
    onChange?.(newLayers);
  };

  return (
    <div className="space-y-3">
      {layers.map((layer) => (
        <div key={layer.id} className="flex items-start space-x-2">
          <Checkbox
            id={`layer-${layer.id}`}
            checked={layer.visible}
            onCheckedChange={() => handleLayerToggle(layer.id)}
          />
          <div className="grid gap-1.5 leading-none">
            <label
              htmlFor={`layer-${layer.id}`}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              {layer.name}
            </label>
            {layer.description && (
              <p className="text-xs text-muted-foreground">
                {layer.description}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
