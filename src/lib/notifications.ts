export interface Notification {
  id: string;
  type: "alert" | "tariff" | "recommendation";
  title: string;
  message: string;
  timestamp: string; // ISO format for consistency
  priority: "high" | "medium" | "low";
  actionable: boolean;
  read: boolean;
  category?: string; // Optional for backward compatibility
}

export const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "alert",
    title: "Consumo Inusual Detectado",
    message: "Tu consumo energético ha aumentado un 35% en las últimas 24 horas comparado con el promedio semanal.",
    timestamp: "2024-10-23T10:30:00Z",
    priority: "high",
    actionable: true,
    read: false,
    category: "Consumo"
  },
  {
    id: "2",
    type: "tariff",
    title: "Cambio Tarifario Próximo",
    message: "Se espera un incremento del 8% en la tarifa de energía a partir del próximo mes.",
    timestamp: "2024-10-23T08:15:00Z",
    priority: "medium",
    actionable: true,
    read: false,
    category: "Tarifas"
  },
  {
    id: "3",
    type: "recommendation",
    title: "Oportunidad de Ahorro",
    message: "Cambiando el horario de operación de maquinaria pesada a horario valle podrías ahorrar hasta $1,800,000 COP/mes.",
    timestamp: "2024-10-23T06:45:00Z",
    priority: "medium",
    actionable: true,
    read: false,
    category: "Ahorro"
  },
  {
    id: "4",
    type: "recommendation",
    title: "Mantenimiento Preventivo",
    message: "El sistema detectó eficiencia reducida en equipos de climatización. Considera una revisión técnica.",
    timestamp: "2024-10-22T14:20:00Z",
    priority: "low",
    actionable: false,
    read: true,
    category: "Mantenimiento"
  },
  {
    id: "5",
    type: "alert",
    title: "Pico de Demanda Excedido",
    message: "Has excedido el límite de demanda contratada. Considera optimizar tu consumo.",
    timestamp: "2024-10-20T16:30:00Z",
    priority: "high",
    actionable: true,
    read: true,
    category: "Demanda"
  },
  {
    id: "6",
    type: "tariff",
    title: "Nueva Tarifa Disponible",
    message: "Una nueva tarifa más económica está disponible para tu perfil de consumo.",
    timestamp: "2024-10-19T09:15:00Z",
    priority: "low",
    actionable: true,
    read: true,
    category: "Tarifas"
  },
  {
    id: "7",
    type: "recommendation",
    title: "Eficiencia Energética",
    message: "Instalando paneles solares podrías reducir tu factura en un 40%.",
    timestamp: "2024-10-16T11:00:00Z",
    priority: "medium",
    actionable: true,
    read: true,
    category: "Sostenibilidad"
  },
  {
    id: "8",
    type: "alert",
    title: "Corte de Energía Programado",
    message: "Mantenimiento programado en tu zona el próximo sábado de 8:00 AM a 12:00 PM.",
    timestamp: "2024-10-15T15:45:00Z",
    priority: "high",
    actionable: false,
    read: true,
    category: "Mantenimiento"
  }
];

// Helper function to format timestamp as relative time
export const formatTimestamp = (timestamp: string): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

  if (diffInHours < 1) return "Hace menos de 1 hora";
  if (diffInHours < 24) return `Hace ${diffInHours} hora${diffInHours > 1 ? 's' : ''}`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `Hace ${diffInDays} día${diffInDays > 1 ? 's' : ''}`;

  return date.toLocaleDateString('es-CO', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};
