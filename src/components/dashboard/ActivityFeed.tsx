"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Zap, 
  TrendingDown, 
  TrendingUp, 
  Leaf, 
  AlertTriangle, 
  CheckCircle2,
  Lightbulb,
  DollarSign,
  Clock,
  Users,
  Activity,
  Trophy,
  Star,
  Flame,
  Crown,
  Award,
  TrendingUp as TrendingUpIcon,
  Shield,
  Target,
  Sparkles
} from "lucide-react";
import Image from "next/image";
import { getCelsiaLogoUrl } from "@/lib/url-utils";
import { motion, AnimatePresence } from "framer-motion";
// Simple time formatter
const formatTimeAgo = (date: Date): string => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return 'hace unos segundos';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `hace ${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `hace ${hours} ${hours === 1 ? 'hora' : 'horas'}`;
  } else {
    const days = Math.floor(diffInSeconds / 86400);
    return `hace ${days} ${days === 1 ? 'día' : 'días'}`;
  }
};

interface ActivityItem {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  userInitials: string;
  type: 'consumption' | 'savings' | 'alert' | 'achievement' | 'tip' | 'tariff' | 'sharing';
  action: string;
  details?: string;
  value?: string;
  timestamp: Date;
  isOwn: boolean;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  // New differentiating factors
  badge?: 'featured' | 'trending' | 'official' | null;
  reward?: {
    type: 'trophy' | 'star' | 'crown' | 'award' | 'shield';
    label: string;
    color: string;
  } | null;
  level?: number | null;
  streak?: number | null;
  cardStyle?: 'default' | 'highlight' | 'gradient';
  showCelsiaLogo?: boolean;
  rightBadge?: {
    type: 'trophy' | 'suggestion' | 'tip' | 'achievement' | 'trending' | 'popular';
    icon: React.ReactNode;
    color: string;
    bgColor: string;
  } | null;
}

// Generate avatar URL using UI Avatars service
const getAvatarUrl = (name: string, initials: string, isCompany: boolean = false): string => {
  const baseUrl = 'https://ui-avatars.com/api/';
  const params = new URLSearchParams({
    name: initials,
    size: '128',
    background: isCompany 
      ? Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0') // Random color for companies
      : 'random', // Random colors for people
    color: 'fff',
    bold: 'true',
    format: 'png',
  });
  return `${baseUrl}?${params.toString()}`;
};

// Alternative: Use DiceBear Avatars for more variety
const getDiceBearAvatar = (name: string, style: 'avataaars' | 'adventurer' | 'big-smile' | 'bottts' | 'icons' | 'identicon' | 'lorelei' | 'micah' | 'miniavs' | 'open-peeps' | 'personas' | 'pixel-art' | 'shapes' | 'thumbs' = 'avataaars'): string => {
  const seed = name.toLowerCase().replace(/\s+/g, '-');
  return `https://api.dicebear.com/7.x/${style}/svg?seed=${seed}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf&size=128`;
};

// Mock data generator
const generateActivities = (count: number, offset: number = 0): ActivityItem[] => {
  const users = [
    { name: "María González", initials: "MG", avatar: null, isCompany: false },
    { name: "Carlos Rodríguez", initials: "CR", avatar: null, isCompany: false },
    { name: "Ana Martínez", initials: "AM", avatar: null, isCompany: false },
    { name: "Luis Pérez", initials: "LP", avatar: null, isCompany: false },
    { name: "Sofia López", initials: "SL", avatar: null, isCompany: false },
    { name: "Juan Torres", initials: "JT", avatar: null, isCompany: false },
    { name: "Empresa Energética SA", initials: "EES", avatar: null, isCompany: true },
    { name: "Green Solutions", initials: "GS", avatar: null, isCompany: true },
    { name: "PowerTech Colombia", initials: "PTC", avatar: null, isCompany: true },
    { name: "Tu", initials: "T", avatar: null, isOwn: true, isCompany: false },
  ];

  const rewardTypes = [
    { type: 'trophy' as const, label: 'Campeón', color: 'text-yellow-600' },
    { type: 'star' as const, label: 'Destacado', color: 'text-blue-600' },
    { type: 'crown' as const, label: 'Líder', color: 'text-purple-600' },
    { type: 'award' as const, label: 'Mérito', color: 'text-green-600' },
    { type: 'shield' as const, label: 'Protección', color: 'text-indigo-600' },
  ];

  const badgeTypes: Array<'featured' | 'trending' | 'official' | null> = [
    'featured',
    'trending',
    'official',
    null,
    null,
    null,
  ];

  const cardStyles: Array<'default' | 'highlight' | 'gradient'> = [
    'default',
    'highlight',
    'gradient',
    'default',
    'default',
  ];

  const rightBadgeTypes: Array<{
    type: 'trophy' | 'suggestion' | 'tip' | 'achievement' | 'trending' | 'popular';
    icon: React.ReactNode;
    color: string;
    bgColor: string;
  }> = [
    {
      type: 'trophy',
      icon: <Trophy className="h-5 w-5" />,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      type: 'suggestion',
      icon: <Lightbulb className="h-5 w-5" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      type: 'tip',
      icon: <Sparkles className="h-5 w-5" />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      type: 'achievement',
      icon: <Award className="h-5 w-5" />,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      type: 'trending',
      icon: <TrendingUpIcon className="h-5 w-5" />,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      type: 'popular',
      icon: <Star className="h-5 w-5" />,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50'
    },
  ];

  const activityTypes: Array<{
    type: ActivityItem['type'];
    templates: Array<{ action: string; details?: string; value?: string }>;
    icon: React.ReactNode;
    color: string;
    bgColor: string;
  }> = [
    {
      type: 'consumption',
      templates: [
        { action: "redujo su consumo energético", details: "en el último mes", value: "12%" },
        { action: "optimizó sus horarios de consumo", details: "moviendo actividades a horas valle" },
        { action: "completó un análisis de consumo", details: "identificando oportunidades de ahorro" },
      ],
      icon: <TrendingDown className="h-4 w-4" />,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      type: 'savings',
      templates: [
        { action: "logró un ahorro de", value: "$125,000 COP", details: "este mes" },
        { action: "alcanzó su meta de ahorro", value: "15%", details: "en el trimestre" },
        { action: "ahorró energía equivalente a", value: "45 árboles", details: "plantados" },
      ],
      icon: <DollarSign className="h-4 w-4" />,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      type: 'achievement',
      templates: [
        { action: "obtuvo la insignia", value: "Eco-Héroe", details: "por ahorro sostenible" },
        { action: "completó el desafío", value: "30 días verdes", details: "sin consumo en horas pico" },
        { action: "alcanzó el nivel", value: "Experto en Eficiencia", details: "en gestión energética" },
      ],
      icon: <CheckCircle2 className="h-4 w-4" />,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      type: 'tip',
      templates: [
        { action: "compartió un consejo:", details: "Usar termostatos inteligentes puede reducir hasta 20% el consumo" },
        { action: "recomendó:", details: "Programar lavadoras después de las 10 PM para aprovechar tarifas valle" },
        { action: "sugirió:", details: "Revisar sellos de puertas y ventanas para mejorar eficiencia térmica" },
      ],
      icon: <Lightbulb className="h-4 w-4" />,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50"
    },
    {
      type: 'alert',
      templates: [
        { action: "recibió una alerta de consumo alto", details: "en horas pico, considerando optimizar" },
        { action: "detectó una anomalía", details: "en su patrón de consumo, revisando equipos" },
      ],
      icon: <AlertTriangle className="h-4 w-4" />,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    },
    {
      type: 'tariff',
      templates: [
        { action: "consultó su desglose de tarifa", details: "analizando componentes del costo" },
        { action: "simuló un cambio de tarifa", details: "comparando opciones disponibles" },
      ],
      icon: <Activity className="h-4 w-4" />,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50"
    },
    {
      type: 'sharing',
      templates: [
        { action: "compartió su progreso", details: "de ahorro energético este mes" },
        { action: "publicó su reporte", details: "de impacto ambiental" },
      ],
      icon: <Users className="h-4 w-4" />,
      color: "text-pink-600",
      bgColor: "bg-pink-50"
    },
  ];

  const activities: ActivityItem[] = [];
  const now = new Date();

  for (let i = 0; i < count; i++) {
    const user = users[Math.floor(Math.random() * users.length)];
    const activityType = activityTypes[Math.floor(Math.random() * activityTypes.length)];
    const template = activityType.templates[Math.floor(Math.random() * activityType.templates.length)];
    
    // Generate timestamp (more recent activities first)
    const minutesAgo = offset * 10 + i * 5 + Math.floor(Math.random() * 5);
    const timestamp = new Date(now.getTime() - minutesAgo * 60000);

    // Random differentiating factors
    const hasBadge = Math.random() > 0.7;
    const badge = hasBadge ? badgeTypes[Math.floor(Math.random() * badgeTypes.length)] : null;
    
    const hasReward = Math.random() > 0.6;
    const reward = hasReward ? rewardTypes[Math.floor(Math.random() * rewardTypes.length)] : null;
    
    const hasLevel = Math.random() > 0.5;
    const level = hasLevel ? Math.floor(Math.random() * 50) + 1 : null;
    
    const hasStreak = Math.random() > 0.7;
    const streak = hasStreak ? Math.floor(Math.random() * 30) + 1 : null;
    
    const cardStyle = cardStyles[Math.floor(Math.random() * cardStyles.length)];
    const showCelsiaLogo = Math.random() > 0.85 || badge === 'official';
    
    // Right badge (trophy or suggestion)
    const hasRightBadge = Math.random() > 0.4; // 60% chance
    const rightBadge = hasRightBadge 
      ? rightBadgeTypes[Math.floor(Math.random() * rightBadgeTypes.length)]
      : null;

    // Generate avatar URL - use DiceBear for variety, fallback to UI Avatars
    const avatarUrl = user.avatar || getDiceBearAvatar(
      user.name, 
      (user as any).isCompany ? 'identicon' : 'avataaars'
    );

    activities.push({
      id: `activity-${offset + i}`,
      userId: user.name.toLowerCase().replace(/\s+/g, '-'),
      userName: user.name,
      userAvatar: avatarUrl,
      userInitials: user.initials,
      type: activityType.type,
      action: template.action,
      details: template.details,
      value: template.value,
      timestamp,
      isOwn: (user as any).isOwn || false,
      icon: activityType.icon,
      color: activityType.color,
      bgColor: activityType.bgColor,
      badge,
      reward: reward ? {
        type: reward.type,
        label: reward.label,
        color: reward.color
      } : null,
      level,
      streak,
      cardStyle,
      showCelsiaLogo,
      rightBadge: rightBadge ? {
        type: rightBadge.type,
        icon: rightBadge.icon,
        color: rightBadge.color,
        bgColor: rightBadge.bgColor
      } : null,
    });
  }

  return activities;
};

export default function ActivityFeed() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const observerTarget = useRef<HTMLDivElement>(null);
  const realTimeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const maxActivities = 100; // Maximum number of activities to keep in memory

  const loadMoreActivities = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newActivities = generateActivities(10, page * 10);
    
    if (newActivities.length === 0) {
      setHasMore(false);
    } else {
      setActivities(prev => [...prev, ...newActivities]);
      setPage(prev => prev + 1);
    }
    
    setIsLoading(false);
  }, [isLoading, hasMore, page]);

  // Generate new activity for real-time updates
  const generateNewActivity = useCallback((): ActivityItem => {
    const users = [
      { name: "María González", initials: "MG", avatar: null, isCompany: false },
      { name: "Carlos Rodríguez", initials: "CR", avatar: null, isCompany: false },
      { name: "Ana Martínez", initials: "AM", avatar: null, isCompany: false },
      { name: "Luis Pérez", initials: "LP", avatar: null, isCompany: false },
      { name: "Sofia López", initials: "SL", avatar: null, isCompany: false },
      { name: "Juan Torres", initials: "JT", avatar: null, isCompany: false },
      { name: "Empresa Energética SA", initials: "EES", avatar: null, isCompany: true },
      { name: "Green Solutions", initials: "GS", avatar: null, isCompany: true },
      { name: "PowerTech Colombia", initials: "PTC", avatar: null, isCompany: true },
      { name: "Tu", initials: "T", avatar: null, isOwn: true, isCompany: false },
    ];

    const activityTypes: Array<{
      type: ActivityItem['type'];
      templates: Array<{ action: string; details?: string; value?: string }>;
      icon: React.ReactNode;
      color: string;
      bgColor: string;
    }> = [
      {
        type: 'consumption',
        templates: [
          { action: "redujo su consumo energético", details: "en el último mes", value: "12%" },
          { action: "optimizó sus horarios de consumo", details: "moviendo actividades a horas valle" },
          { action: "completó un análisis de consumo", details: "identificando oportunidades de ahorro" },
        ],
        icon: <TrendingDown className="h-4 w-4" />,
        color: "text-green-600",
        bgColor: "bg-green-50"
      },
      {
        type: 'savings',
        templates: [
          { action: "logró un ahorro de", value: "$125,000 COP", details: "este mes" },
          { action: "alcanzó su meta de ahorro", value: "15%", details: "en el trimestre" },
          { action: "ahorró energía equivalente a", value: "45 árboles", details: "plantados" },
        ],
        icon: <DollarSign className="h-4 w-4" />,
        color: "text-blue-600",
        bgColor: "bg-blue-50"
      },
      {
        type: 'achievement',
        templates: [
          { action: "obtuvo la insignia", value: "Eco-Héroe", details: "por ahorro sostenible" },
          { action: "completó el desafío", value: "30 días verdes", details: "sin consumo en horas pico" },
          { action: "alcanzó el nivel", value: "Experto en Eficiencia", details: "en gestión energética" },
        ],
        icon: <CheckCircle2 className="h-4 w-4" />,
        color: "text-purple-600",
        bgColor: "bg-purple-50"
      },
      {
        type: 'tip',
        templates: [
          { action: "compartió un consejo:", details: "Usar termostatos inteligentes puede reducir hasta 20% el consumo" },
          { action: "recomendó:", details: "Programar lavadoras después de las 10 PM para aprovechar tarifas valle" },
          { action: "sugirió:", details: "Revisar sellos de puertas y ventanas para mejorar eficiencia térmica" },
        ],
        icon: <Lightbulb className="h-4 w-4" />,
        color: "text-yellow-600",
        bgColor: "bg-yellow-50"
      },
      {
        type: 'alert',
        templates: [
          { action: "recibió una alerta de consumo alto", details: "en horas pico, considerando optimizar" },
          { action: "detectó una anomalía", details: "en su patrón de consumo, revisando equipos" },
        ],
        icon: <AlertTriangle className="h-4 w-4" />,
        color: "text-orange-600",
        bgColor: "bg-orange-50"
      },
      {
        type: 'tariff',
        templates: [
          { action: "consultó su desglose de tarifa", details: "analizando componentes del costo" },
          { action: "simuló un cambio de tarifa", details: "comparando opciones disponibles" },
        ],
        icon: <Activity className="h-4 w-4" />,
        color: "text-indigo-600",
        bgColor: "bg-indigo-50"
      },
      {
        type: 'sharing',
        templates: [
          { action: "compartió su progreso", details: "de ahorro energético este mes" },
          { action: "publicó su reporte", details: "de impacto ambiental" },
        ],
        icon: <Users className="h-4 w-4" />,
        color: "text-pink-600",
        bgColor: "bg-pink-50"
      },
    ];

    const rewardTypes = [
      { type: 'trophy' as const, label: 'Campeón', color: 'text-yellow-600' },
      { type: 'star' as const, label: 'Destacado', color: 'text-blue-600' },
      { type: 'crown' as const, label: 'Líder', color: 'text-purple-600' },
      { type: 'award' as const, label: 'Mérito', color: 'text-green-600' },
      { type: 'shield' as const, label: 'Protección', color: 'text-indigo-600' },
    ];

    const badgeTypes: Array<'featured' | 'trending' | 'official' | null> = [
      'featured',
      'trending',
      'official',
      null,
      null,
      null,
    ];

    const cardStyles: Array<'default' | 'highlight' | 'gradient'> = [
      'default',
      'highlight',
      'gradient',
      'default',
      'default',
    ];

    const rightBadgeTypes: Array<{
      type: 'trophy' | 'suggestion' | 'tip' | 'achievement' | 'trending' | 'popular';
      icon: React.ReactNode;
      color: string;
      bgColor: string;
    }> = [
      {
        type: 'trophy',
        icon: <Trophy className="h-5 w-5" />,
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50'
      },
      {
        type: 'suggestion',
        icon: <Lightbulb className="h-5 w-5" />,
        color: 'text-blue-600',
        bgColor: 'bg-blue-50'
      },
      {
        type: 'tip',
        icon: <Sparkles className="h-5 w-5" />,
        color: 'text-purple-600',
        bgColor: 'bg-purple-50'
      },
      {
        type: 'achievement',
        icon: <Award className="h-5 w-5" />,
        color: 'text-green-600',
        bgColor: 'bg-green-50'
      },
      {
        type: 'trending',
        icon: <TrendingUpIcon className="h-5 w-5" />,
        color: 'text-orange-600',
        bgColor: 'bg-orange-50'
      },
      {
        type: 'popular',
        icon: <Star className="h-5 w-5" />,
        color: 'text-pink-600',
        bgColor: 'bg-pink-50'
      },
    ];

    const user = users[Math.floor(Math.random() * users.length)];
    const activityType = activityTypes[Math.floor(Math.random() * activityTypes.length)];
    const template = activityType.templates[Math.floor(Math.random() * activityType.templates.length)];
    
    const timestamp = new Date();

    const hasBadge = Math.random() > 0.7;
    const badge = hasBadge ? badgeTypes[Math.floor(Math.random() * badgeTypes.length)] : null;
    
    const hasReward = Math.random() > 0.6;
    const reward = hasReward ? rewardTypes[Math.floor(Math.random() * rewardTypes.length)] : null;
    
    const hasLevel = Math.random() > 0.5;
    const level = hasLevel ? Math.floor(Math.random() * 50) + 1 : null;
    
    const hasStreak = Math.random() > 0.7;
    const streak = hasStreak ? Math.floor(Math.random() * 30) + 1 : null;
    
    const cardStyle = cardStyles[Math.floor(Math.random() * cardStyles.length)];
    const showCelsiaLogo = Math.random() > 0.85 || badge === 'official';
    
    const hasRightBadge = Math.random() > 0.4;
    const rightBadge = hasRightBadge 
      ? rightBadgeTypes[Math.floor(Math.random() * rightBadgeTypes.length)]
      : null;

    const avatarUrl = getDiceBearAvatar(
      user.name, 
      (user as any).isCompany ? 'identicon' : 'avataaars'
    );

    return {
      id: `activity-realtime-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId: user.name.toLowerCase().replace(/\s+/g, '-'),
      userName: user.name,
      userAvatar: avatarUrl,
      userInitials: user.initials,
      type: activityType.type,
      action: template.action,
      details: template.details,
      value: template.value,
      timestamp,
      isOwn: (user as any).isOwn || false,
      icon: activityType.icon,
      color: activityType.color,
      bgColor: activityType.bgColor,
      badge,
      reward: reward ? {
        type: reward.type,
        label: reward.label,
        color: reward.color
      } : null,
      level,
      streak,
      cardStyle,
      showCelsiaLogo,
      rightBadge: rightBadge ? {
        type: rightBadge.type,
        icon: rightBadge.icon,
        color: rightBadge.color,
        bgColor: rightBadge.bgColor
      } : null,
    };
  }, []);

  // Real-time update function
  const addNewActivity = useCallback(() => {
    const newActivity = generateNewActivity();
    setActivities(prev => {
      // Add new activity at the beginning (most recent first)
      const updated = [newActivity, ...prev];
      // Keep only the most recent activities to prevent memory issues
      return updated.slice(0, maxActivities);
    });
  }, [generateNewActivity]);

  // Initial load
  useEffect(() => {
    const initialActivities = generateActivities(10, 0);
    setActivities(initialActivities);
    setPage(1);
  }, []);

  // Real-time updates loop
  useEffect(() => {
    // Start real-time updates after initial load
    const startRealTimeUpdates = () => {
      // Random interval between 3-8 seconds for more realistic simulation
      const getRandomInterval = () => Math.floor(Math.random() * 5000) + 3000;
      
      const scheduleNextUpdate = () => {
        realTimeIntervalRef.current = setTimeout(() => {
          addNewActivity();
          scheduleNextUpdate();
        }, getRandomInterval());
      };

      scheduleNextUpdate();
    };

    // Start updates after 2 seconds of initial load
    const startTimeout = setTimeout(() => {
      startRealTimeUpdates();
    }, 2000);

    return () => {
      clearTimeout(startTimeout);
      if (realTimeIntervalRef.current) {
        clearTimeout(realTimeIntervalRef.current);
      }
    };
  }, [addNewActivity]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          loadMoreActivities();
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, isLoading, loadMoreActivities]);

  return (
    <Card className="bg-card border-border">
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Zap className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">Centro de Energía Celsia</h2>
            <p className="text-sm text-muted-foreground">Últimas actividades de la comunidad</p>
          </div>
        </div>
      </div>

      <div className="max-h-[600px] overflow-y-auto">
        <div className="p-4 space-y-4">
          {/* Real-time indicator */}
          <div className="flex items-center justify-center pb-2 sticky top-0 bg-card z-10">
            <div className="flex items-center gap-2 text-xs text-muted-foreground bg-primary/5 px-3 py-1.5 rounded-full border border-primary/20">
              <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
              <span>Actualizaciones en tiempo real</span>
            </div>
          </div>
          
          <AnimatePresence mode="popLayout">
            {activities.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95, height: 0 }}
                transition={{ 
                  duration: 0.4,
                  delay: index === 0 ? 0 : 0.05 // New activities appear faster
                }}
                layout
              >
                <div className={`relative flex gap-4 p-4 rounded-lg border transition-all hover:shadow-md ${
                  activity.cardStyle === 'highlight' 
                    ? activity.isOwn 
                      ? 'bg-primary/10 border-primary/30 shadow-sm' 
                      : 'bg-accent/30 border-accent/40 shadow-sm'
                    : activity.cardStyle === 'gradient'
                      ? `bg-gradient-to-br ${activity.bgColor} border-${activity.color.split('-')[1]}/30`
                      : activity.isOwn 
                        ? 'bg-primary/5 border-primary/20' 
                        : 'bg-background border-border'
                }`}>
                  {/* Right Badge - Trophy or Suggestion */}
                  {activity.rightBadge && (
                    <div className={`absolute top-4 right-4 ${activity.rightBadge.bgColor} ${activity.rightBadge.color} rounded-full p-2 shadow-sm border border-current/20 hover:scale-110 transition-transform cursor-pointer`} title={
                      activity.rightBadge.type === 'trophy' ? 'Logro destacado' :
                      activity.rightBadge.type === 'suggestion' ? 'Sugerencia valiosa' :
                      activity.rightBadge.type === 'tip' ? 'Consejo útil' :
                      activity.rightBadge.type === 'achievement' ? 'Conquista alcanzada' :
                      activity.rightBadge.type === 'trending' ? 'En tendencia' :
                      'Popular'
                    }>
                      {activity.rightBadge.icon}
                    </div>
                  )}
                  {/* Badge indicators */}
                  {activity.badge === 'featured' && (
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-yellow-500 text-white border-0 text-xs flex items-center gap-1">
                        <Star className="h-3 w-3 fill-current" />
                        Destacado
                      </Badge>
                    </div>
                  )}
                  {activity.badge === 'trending' && (
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-orange-500 text-white border-0 text-xs flex items-center gap-1">
                        <TrendingUpIcon className="h-3 w-3" />
                        Trending
                      </Badge>
                    </div>
                  )}
                  {activity.badge === 'official' && (
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-blue-600 text-white border-0 text-xs flex items-center gap-1">
                        <Shield className="h-3 w-3" />
                        Oficial
                      </Badge>
                    </div>
                  )}

                  {/* Celsia Logo */}
                  {activity.showCelsiaLogo && (
                    <div className="absolute top-2 left-2 z-20 bg-white/95 backdrop-blur-sm rounded-full p-1.5 shadow-lg border-2 border-primary/30">
                      <Image
                        src={getCelsiaLogoUrl()}
                        alt="Celsia"
                        width={18}
                        height={18}
                        className="object-contain"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  )}

                  <div className="relative z-10">
                    <Avatar className={`h-12 w-12 ${activity.reward ? 'ring-2 ring-offset-2' : ''} ${
                      activity.reward?.type === 'trophy' ? 'ring-yellow-500' :
                      activity.reward?.type === 'star' ? 'ring-blue-500' :
                      activity.reward?.type === 'crown' ? 'ring-purple-500' :
                      activity.reward?.type === 'award' ? 'ring-green-500' :
                      activity.reward?.type === 'shield' ? 'ring-indigo-500' : ''
                    }`}>
                      <AvatarImage 
                        src={activity.userAvatar} 
                        alt={activity.userName}
                        className="object-cover"
                      />
                      <AvatarFallback className={activity.isOwn ? 'bg-primary text-primary-foreground' : 'bg-muted'}>
                        {activity.userInitials}
                      </AvatarFallback>
                    </Avatar>
                    {activity.reward && (
                      <div className={`absolute -bottom-1 -right-1 ${activity.reward.color} bg-white rounded-full p-0.5`}>
                        {activity.reward.type === 'trophy' && <Trophy className="h-4 w-4 fill-current" />}
                        {activity.reward.type === 'star' && <Star className="h-4 w-4 fill-current" />}
                        {activity.reward.type === 'crown' && <Crown className="h-4 w-4 fill-current" />}
                        {activity.reward.type === 'award' && <Award className="h-4 w-4 fill-current" />}
                        {activity.reward.type === 'shield' && <Shield className="h-4 w-4 fill-current" />}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`font-semibold text-sm ${activity.isOwn ? 'text-primary' : 'text-foreground'}`}>
                          {activity.userName}
                        </span>
                        {activity.isOwn && (
                          <Badge variant="outline" className="text-xs border-primary/30 text-primary">
                            Tú
                          </Badge>
                        )}
                        {activity.level && (
                          <Badge variant="outline" className="text-xs border-blue-300 text-blue-700 bg-blue-50">
                            <Target className="h-3 w-3 mr-1" />
                            Nv. {activity.level}
                          </Badge>
                        )}
                        {activity.reward && (
                          <Badge className={`text-xs ${activity.reward.color} bg-white border`}>
                            {activity.reward.label}
                          </Badge>
                        )}
                        <span className="text-sm text-muted-foreground">
                          {activity.action}
                        </span>
                        {activity.value && (
                          <span className={`font-bold text-sm ${activity.color}`}>
                            {activity.value}
                          </span>
                        )}
                      </div>
                    </div>

                    {activity.details && (
                      <p className="text-sm text-muted-foreground mb-2">
                        {activity.details}
                      </p>
                    )}

                    <div className="flex items-center gap-3 mt-2 flex-wrap">
                      <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${activity.bgColor} ${activity.color}`}>
                        {activity.icon}
                        <span className="text-xs font-medium capitalize">
                          {activity.type === 'consumption' ? 'Consumo' :
                           activity.type === 'savings' ? 'Ahorro' :
                           activity.type === 'achievement' ? 'Logro' :
                           activity.type === 'tip' ? 'Consejo' :
                           activity.type === 'alert' ? 'Alerta' :
                           activity.type === 'tariff' ? 'Tarifa' :
                           'Compartido'}
                        </span>
                      </div>
                      {activity.streak && (
                        <Badge variant="outline" className="text-xs border-orange-300 text-orange-700 bg-orange-50 flex items-center gap-1">
                          <Flame className="h-3 w-3 fill-orange-500" />
                          {activity.streak} días
                        </Badge>
                      )}
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>
                          {formatTimeAgo(activity.timestamp)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Loading indicator */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center py-8"
            >
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <span className="text-sm">Cargando más actividades...</span>
              </div>
            </motion.div>
          )}

          {/* End of feed */}
          {!hasMore && activities.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center py-8"
            >
              <div className="flex items-center gap-2 text-muted-foreground">
                <CheckCircle2 className="h-4 w-4" />
                <span className="text-sm">Has visto todas las actividades</span>
              </div>
            </motion.div>
          )}

          {/* Observer target */}
          <div ref={observerTarget} className="h-1" />
        </div>
      </div>
    </Card>
  );
}

