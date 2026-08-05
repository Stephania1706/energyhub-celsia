import { AlertType } from '@/types/map';
import { cn } from '@/lib/utils';
import { Clock, Users, MapPin, HardHat, Shield, AlertTriangle, Wrench, Construction } from 'lucide-react';
import { Badge } from '../ui/badge';

interface MapLegendProps {
  className?: string;
  activeFilters?: AlertType[];
  onFilterChange?: (type: AlertType, checked: boolean) => void;
}

export const alertTypeConfig: Record<AlertType, {
  label: string;
  icon: React.ReactNode;
  color: string;
  description: string;
}> = {
  outage: {
    label: 'Cortes de Energía',
    icon: <AlertTriangle className="w-4 h-4" />,
    color: 'bg-red-500',
    description: 'Interrupciones planificadas y no planificadas en el servicio eléctrico',
  },
  maintenance: {
    label: 'Mantenimiento',
    icon: <Wrench className="w-4 h-4" />,
    color: 'bg-yellow-500',
    description: 'Trabajos de mantenimiento programados en la red eléctrica',
  },
  construction: {
    label: 'Construcción',
    icon: <HardHat className="w-4 h-4" />,
    color: 'bg-orange-500',
    description: 'Nuevas construcciones y ampliaciones en la red eléctrica',
  },
  cleaning: {
    label: 'Limpieza',
    icon: <Shield className="w-4 h-4" />,
    color: 'bg-green-500',
    description: 'Trabajos de limpieza y despeje de la red eléctrica',
  },
  protection: {
    label: 'Protección',
    icon: <Shield className="w-4 h-4" />,
    color: 'bg-blue-500',
    description: 'Trabajos de protección y mantenimiento preventivo',
  },
  incident: {
    label: 'Incidentes',
    icon: <AlertTriangle className="w-4 h-4" />,
    color: 'bg-pink-500',
    description: 'Incidentes reportados en la red eléctrica',
  },
  scheduled: {
    label: 'Programados',
    icon: <Clock className="w-4 h-4" />,
    color: 'bg-indigo-500',
    description: 'Eventos programados en la red eléctrica',
  },
  emergency: {
    label: 'Emergencias',
    icon: <AlertTriangle className="w-4 h-4" />,
    color: 'bg-red-700',
    description: 'Emergencias en la red eléctrica',
  },
  alert: {
    label: 'Alertas',
    icon: <AlertTriangle className="w-4 h-4" />,
    color: 'bg-blue-500',
    description: 'Alertas generales',
  },
};

export function MapLegend({ className, activeFilters = [], onFilterChange }: MapLegendProps) {
  return (
    <div className={cn('bg-background/95 backdrop-blur-sm border rounded-lg p-4 shadow-lg', className)}>
      <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
        <MapPin className="w-4 h-4" />
        Leyenda del Mapa
      </h3>
      <div className="space-y-3">
        {Object.entries(alertTypeConfig).map(([type, config]) => {
          const isActive = activeFilters.includes(type as AlertType);
          const Icon = config.icon;
          
          return (
            <div 
              key={type}
              className={cn(
                'flex items-start gap-2 p-2 rounded-md transition-colors',
                'hover:bg-accent/50 cursor-pointer',
                isActive && 'bg-accent/30'
              )}
              onClick={() => onFilterChange?.(type as AlertType, !isActive)}
            >
              <div className={cn('w-6 h-6 rounded-full flex items-center justify-center text-white mt-0.5', config.color)}>
                {config.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{config.label}</span>
                  <div className={cn(
                    'w-3 h-3 rounded-full border-2 border-muted',
                    isActive ? 'bg-primary' : 'bg-transparent'
                  )} />
                </div>
                <p className="text-xs text-muted-foreground">{config.description}</p>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Status Legend */}
      <div className="mt-4 pt-4 border-t">
        <h4 className="text-xs font-medium text-muted-foreground mb-2">Estado</h4>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-xs">Activo</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span className="text-xs">En Progreso</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-xs">Resuelto</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-xs">Programado</span>
          </div>
        </div>
      </div>
    </div>
  );
}
