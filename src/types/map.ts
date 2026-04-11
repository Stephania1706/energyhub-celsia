export type AlertType = 'outage' | 'maintenance' | 'construction' | 'incident' | 'scheduled' | 'emergency' | 'alert' | 'cleaning' | 'protection';

export interface AlertDetails {
  // Common fields
  startDate?: string;
  endDate?: string;
  duration?: string;
  affectedUsers?: number;
  status?: 'activo' | 'en_proceso' | 'resuelto' | 'programado' | 'completado';
  
  // Outage specific
  cause?: string;
  estimatedRestoration?: string;
  
  // Construction specific
  projectName?: string;
  investment?: string;
  contractor?: string;
  schedule?: string;
  
  // Cleaning/Protection specific
  progress?: number;
  team?: string;
  responsible?: string;
  sectors?: string;
  
  // Location and contact
  address?: string;
  contactNumber?: string;
  lastUpdated?: string;
}

export interface AlertMarker {
  id: string;
  location: string;
  title: string;
  description: string;
  type: AlertType;
  position: [number, number];
  details: AlertDetails;
  lastUpdated: string;
}

export interface MapMarker {
  position: [number, number];
  type: AlertType;
  popup: string;
  id?: string;
}

export interface MapLayer {
  id: string;
  name: string;
  type: AlertType[];
  visible: boolean;
  description?: string;
}
