import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getAssetUrl } from "@/lib/url-utils";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

// Definición de tipos para los patrones
interface NetworkNode {
  top: string;
  left: string;
  pulseDelay: number;
}

interface NetworkPath {
  d: string;
  flowDuration: number;
  delay: number;
}

interface NetworkPattern {
  id: string;
  name: string;
  nodes: NetworkNode[];
  paths: NetworkPath[];
  description: string;
}

// Definición de patrones de red
const networkPatterns: NetworkPattern[] = [
  {
    id: "original",
    name: "Original",
    description: "Patrón base interconectado",
    nodes: [
      { top: "20%", left: "30%", pulseDelay: 0 },
      { top: "40%", left: "60%", pulseDelay: 0.5 },
      { top: "60%", left: "20%", pulseDelay: 0.8 },
      { top: "70%", left: "70%", pulseDelay: 1.2 },
      { top: "30%", left: "80%", pulseDelay: 1.5 },
    ],
    paths: [
      { d: "M 75 50 Q 125 100 200 80", flowDuration: 3, delay: 0 },
      { d: "M 50 120 Q 100 150 180 200", flowDuration: 4, delay: 0.5 },
      { d: "M 200 60 Q 150 120 80 180", flowDuration: 3.5, delay: 1 },
    ],
  },
  {
    id: "mesh",
    name: "Malla Densa",
    description: "Red densa de conexiones globales",
    nodes: [
      { top: "15%", left: "25%", pulseDelay: 0 },
      { top: "25%", left: "50%", pulseDelay: 0.3 },
      { top: "35%", left: "75%", pulseDelay: 0.6 },
      { top: "50%", left: "20%", pulseDelay: 0.9 },
      { top: "60%", left: "45%", pulseDelay: 1.2 },
      { top: "70%", left: "70%", pulseDelay: 1.5 },
      { top: "80%", left: "30%", pulseDelay: 1.8 },
      { top: "40%", left: "80%", pulseDelay: 2.1 },
    ],
    paths: [
      { d: "M 62.5 37.5 Q 93.75 50 125 50 Q 156.25 50 187.5 62.5", flowDuration: 2.5, delay: 0 },
      { d: "M 125 50 Q 143.75 75 162.5 100 Q 181.25 112.5 187.5 125", flowDuration: 3, delay: 0.3 },
      { d: "M 50 125 Q 75 118.75 100 125 Q 106.25 131.25 112.5 137.5", flowDuration: 2.8, delay: 0.6 },
      { d: "M 112.5 137.5 Q 131.25 143.75 150 156.25 Q 162.5 168.75 175 175", flowDuration: 3.2, delay: 0.9 },
      { d: "M 187.5 87.5 Q 175 100 162.5 112.5 Q 143.75 131.25 125 150", flowDuration: 2.7, delay: 1.2 },
      { d: "M 125 150 Q 106.25 156.25 87.5 175 Q 75 187.5 62.5 200", flowDuration: 3.1, delay: 1.5 },
      { d: "M 50 125 Q 68.75 150 87.5 175 Q 100 187.5 112.5 200", flowDuration: 2.9, delay: 1.8 },
      { d: "M 175 100 Q 156.25 112.5 137.5 125 Q 125 131.25 112.5 137.5", flowDuration: 2.6, delay: 2.1 },
    ],
  },
  {
    id: "radial",
    name: "Radial",
    description: "Conexiones desde el centro",
    nodes: [
      { top: "50%", left: "50%", pulseDelay: 0 },
      { top: "20%", left: "30%", pulseDelay: 0.4 },
      { top: "25%", left: "70%", pulseDelay: 0.8 },
      { top: "75%", left: "30%", pulseDelay: 1.2 },
      { top: "80%", left: "70%", pulseDelay: 1.6 },
      { top: "50%", left: "15%", pulseDelay: 2.0 },
      { top: "50%", left: "85%", pulseDelay: 2.4 },
    ],
    paths: [
      { d: "M 125 125 Q 106.25 100 93.75 87.5 Q 81.25 75 62.5 50", flowDuration: 2.5, delay: 0 },
      { d: "M 125 125 Q 143.75 100 156.25 87.5 Q 168.75 75 187.5 62.5", flowDuration: 2.5, delay: 0.5 },
      { d: "M 125 125 Q 106.25 150 93.75 162.5 Q 81.25 175 62.5 200", flowDuration: 2.5, delay: 1 },
      { d: "M 125 125 Q 143.75 150 156.25 162.5 Q 168.75 175 187.5 200", flowDuration: 2.5, delay: 1.5 },
      { d: "M 125 125 Q 106.25 125 87.5 125 Q 68.75 125 37.5 125", flowDuration: 2.5, delay: 2 },
      { d: "M 125 125 Q 143.75 125 162.5 125 Q 181.25 125 212.5 125", flowDuration: 2.5, delay: 2.5 },
    ],
  },
  {
    id: "spiral",
    name: "Espiral",
    description: "Patrón en espiral adaptado al globo",
    nodes: [
      { top: "50%", left: "50%", pulseDelay: 0 },
      { top: "40%", left: "60%", pulseDelay: 0.3 },
      { top: "35%", left: "45%", pulseDelay: 0.6 },
      { top: "45%", left: "30%", pulseDelay: 0.9 },
      { top: "60%", left: "35%", pulseDelay: 1.2 },
      { top: "70%", left: "50%", pulseDelay: 1.5 },
      { top: "65%", left: "70%", pulseDelay: 1.8 },
      { top: "50%", left: "75%", pulseDelay: 2.1 },
    ],
    paths: [
      { d: "M 125 125 Q 137.5 112.5 150 100 Q 168.75 93.75 187.5 87.5", flowDuration: 2.8, delay: 0 },
      { d: "M 187.5 87.5 Q 175 84.375 162.5 81.25 Q 137.5 84.375 112.5 87.5", flowDuration: 3, delay: 0.3 },
      { d: "M 112.5 87.5 Q 100 100 87.5 106.25 Q 75 109.375 62.5 112.5", flowDuration: 2.7, delay: 0.6 },
      { d: "M 62.5 112.5 Q 71.875 131.25 87.5 150 Q 100 162.5 112.5 175", flowDuration: 2.9, delay: 0.9 },
      { d: "M 112.5 175 Q 125 168.75 137.5 168.75 Q 143.75 171.875 150 175", flowDuration: 2.6, delay: 1.2 },
      { d: "M 150 175 Q 162.5 162.5 175 156.25 Q 181.25 159.375 187.5 162.5", flowDuration: 2.8, delay: 1.5 },
      { d: "M 187.5 162.5 Q 175 143.75 162.5 131.25 Q 143.75 125 125 125", flowDuration: 3.1, delay: 1.8 },
    ],
  },
  {
    id: "constellation",
    name: "Constelación",
    description: "Patrón tipo constelación estelar",
    nodes: [
      { top: "20%", left: "20%", pulseDelay: 0 },
      { top: "25%", left: "80%", pulseDelay: 0.4 },
      { top: "50%", left: "15%", pulseDelay: 0.8 },
      { top: "50%", left: "50%", pulseDelay: 1.2 },
      { top: "50%", left: "85%", pulseDelay: 1.6 },
      { top: "75%", left: "20%", pulseDelay: 2.0 },
      { top: "80%", left: "80%", pulseDelay: 2.4 },
    ],
    paths: [
      { d: "M 50 50 Q 100 56.25 150 53.125 Q 175 51.5625 200 50", flowDuration: 3.2, delay: 0 },
      { d: "M 37.5 125 Q 68.75 125 93.75 125 Q 109.375 125 125 125", flowDuration: 2.8, delay: 0.5 },
      { d: "M 125 125 Q 150 125 175 125 Q 193.75 125 212.5 125", flowDuration: 2.8, delay: 1 },
      { d: "M 50 50 Q 71.875 68.75 93.75 87.5 Q 109.375 106.25 125 125", flowDuration: 3, delay: 1.5 },
      { d: "M 200 50 Q 178.125 68.75 156.25 87.5 Q 140.625 106.25 125 125", flowDuration: 3, delay: 2 },
      { d: "M 37.5 125 Q 65.625 156.25 93.75 187.5 Q 46.875 193.75 50 200", flowDuration: 3.2, delay: 2.5 },
      { d: "M 212.5 125 Q 184.375 156.25 156.25 187.5 Q 203.125 193.75 200 200", flowDuration: 3.2, delay: 3 },
      { d: "M 50 200 Q 87.5 193.75 125 187.5 Q 162.5 193.75 200 200", flowDuration: 2.9, delay: 3.5 },
    ],
  },
  {
    id: "wave",
    name: "Ondas",
    description: "Patrón de ondas adaptadas al globo",
    nodes: [
      { top: "30%", left: "20%", pulseDelay: 0 },
      { top: "35%", left: "50%", pulseDelay: 0.5 },
      { top: "40%", left: "80%", pulseDelay: 1 },
      { top: "60%", left: "25%", pulseDelay: 1.5 },
      { top: "65%", left: "55%", pulseDelay: 2 },
      { top: "70%", left: "85%", pulseDelay: 2.5 },
    ],
    paths: [
      { d: "M 50 75 Q 87.5 81.25 125 87.5 Q 162.5 93.75 200 100", flowDuration: 3.5, delay: 0 },
      { d: "M 200 100 Q 162.5 106.25 125 112.5 Q 87.5 118.75 50 125", flowDuration: 3.5, delay: 1 },
      { d: "M 50 125 Q 87.5 131.25 125 137.5 Q 162.5 143.75 200 150", flowDuration: 3.5, delay: 2 },
      { d: "M 200 150 Q 162.5 156.25 125 162.5 Q 87.5 168.75 50 175", flowDuration: 3.5, delay: 3 },
      { d: "M 50 75 Q 71.875 87.5 93.75 100 Q 115.625 112.5 137.5 125", flowDuration: 3.2, delay: 0.5 },
      { d: "M 137.5 125 Q 159.375 137.5 181.25 150 Q 190.625 162.5 200 175", flowDuration: 3.2, delay: 1.5 },
    ],
  },
];

interface GlobeProps {
  contrastMode?: 'light' | 'dark' | 'auto';
}

const Globe: React.FC<GlobeProps> = ({ contrastMode = 'auto' }) => {
  const { theme } = useTheme();
  const [currentPatternIndex, setCurrentPatternIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const currentPattern = networkPatterns[currentPatternIndex];
  const isCelsiaMode = theme === 'celsia';
  const isDarkMode = contrastMode === 'dark';
  
  // Use the same globe image for both modes
  const globeImage = getAssetUrl("/images/globe-light.jpeg");

  const nextPattern = () => {
    setCurrentPatternIndex((prev) => (prev + 1) % networkPatterns.length);
  };

  const prevPattern = () => {
    setCurrentPatternIndex((prev) => (prev - 1 + networkPatterns.length) % networkPatterns.length);
  };

  // Animación automática de evolución de red - simula el crecimiento orgánico de una red
  // Solo activa cuando no está en modo Celsia
  useEffect(() => {
    // No ejecutar animación en modo Celsia
    if (isCelsiaMode) return;
    
    let timeoutId: ReturnType<typeof setTimeout>;
    
    const evolveNetwork = () => {
      setIsTransitioning(true);
      
      // Después de un breve fade out, cambiar al siguiente patrón
      setTimeout(() => {
        setCurrentPatternIndex((prev) => {
          // Simular evolución: 70% probabilidad de ir al siguiente, 30% de saltar aleatoriamente
          // Esto crea una sensación de crecimiento progresivo con ocasional reorganización
          const shouldRandom = Math.random() > 0.7;
          if (shouldRandom) {
            let newIndex;
            do {
              newIndex = Math.floor(Math.random() * networkPatterns.length);
            } while (newIndex === prev && networkPatterns.length > 1);
            return newIndex;
          } else {
            return (prev + 1) % networkPatterns.length;
          }
        });
        
        setTimeout(() => {
          setIsTransitioning(false);
        }, 200);
      }, 600); // Duración de fade out
    };

    // Iniciar la evolución después de un delay inicial
    timeoutId = setTimeout(() => {
      evolveNetwork();
      
      // Continuar evolucionando cada 7-10 segundos (variable para más naturalidad)
      const scheduleNext = () => {
        const delay = 7000 + Math.random() * 3000; // Entre 7 y 10 segundos
        timeoutId = setTimeout(() => {
          evolveNetwork();
          scheduleNext();
        }, delay);
      };
      
      scheduleNext();
    }, 3000); // Esperar 3 segundos antes de empezar

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isCelsiaMode]);

  // Preload earth image for better performance - start loading immediately
  useEffect(() => {
    const img = new Image();
    img.src = globeImage;
    // Preload the image by creating an Image object
  }, [globeImage]);

  return (
    <>
      <style>
        {`
          @keyframes earthRotate {
            0% { background-position: 0 0; }
            100% { background-position: 400px 0; }
          }
          @keyframes earthRotateReverse {
            0% { background-position: 400px 0; }
            100% { background-position: 0 0; }
          }
          @keyframes twinkling { 0%,100% { opacity:0.1; } 50% { opacity:1; } }
          @keyframes twinkling-slow { 0%,100% { opacity:0.1; } 50% { opacity:1; } }
          @keyframes twinkling-long { 0%,100% { opacity:0.1; } 50% { opacity:1; } }
          @keyframes twinkling-fast { 0%,100% { opacity:0.1; } 50% { opacity:1; } }
          @keyframes energyPulse { 
            0%,100% { opacity:0.4; transform: scale(1); filter: brightness(1); } 
            50% { opacity:1; transform: scale(1.15); filter: brightness(1.3); } 
          }
          @keyframes energyFlow { 
            0% { stroke-dashoffset: 200; opacity: 0.6; filter: brightness(0.8); } 
            25% { opacity: 0.9; filter: brightness(1.1); }
            50% { opacity: 1; filter: brightness(1.3); }
            75% { opacity: 0.9; filter: brightness(1.1); }
            100% { stroke-dashoffset: 0; opacity: 0.8; filter: brightness(0.9); } 
          }
          @keyframes globeFlow {
            0% { transform: translateX(0) scale(1); }
            50% { transform: translateX(2px) scale(1.01); }
            100% { transform: translateX(0) scale(1); }
          }
          @keyframes orbitRotate { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
          @keyframes lightning { 0%,90%,100% { opacity: 0; } 5%,85% { opacity: 1; } }
          @keyframes spiderWeb { 0% { stroke-dasharray: 0 1000; } 100% { stroke-dasharray: 1000 0; } }
          @keyframes patternFadeIn {
            0% { opacity: 0; transform: scale(0.95); }
            100% { opacity: 1; transform: scale(1); }
          }
          @keyframes patternEvolve {
            0% { opacity: 1; transform: scale(1); filter: brightness(1); }
            50% { opacity: 0.3; transform: scale(0.98); filter: brightness(0.7); }
            100% { opacity: 1; transform: scale(1); filter: brightness(1); }
          }
          @keyframes networkEvolve {
            0% { opacity: 0.8; }
            50% { opacity: 1; }
            100% { opacity: 0.8; }
          }
          @keyframes nodeGlow {
            0%, 100% { box-shadow: 0 0 10px #f4721e, 0 0 20px #f4721e, 0 0 30px #f4721e; }
            50% { box-shadow: 0 0 15px #f4721e, 0 0 30px #f4721e, 0 0 45px #f4721e, 0 0 60px rgba(244, 114, 30, 0.5); }
          }
          @keyframes clickPulse {
            0% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.5); opacity: 0.7; }
            100% { transform: scale(2); opacity: 0; }
          }
          @keyframes nodeClick {
            0% { transform: translate(-50%, -50%) scale(1); }
            50% { transform: translate(-50%, -50%) scale(1.3); }
            100% { transform: translate(-50%, -50%) scale(1); }
          }
        `}
      </style>
      <div className="flex items-center justify-center h-screen relative">
        {/* Pattern Selector - Hidden in all modes */}
        {false && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-background/90 backdrop-blur-md border border-border/60 rounded-lg px-3 py-2 shadow-lg">
          <button
            onClick={prevPattern}
            className="p-1 hover:bg-accent rounded transition-colors"
            aria-label="Patrón anterior"
          >
            <ChevronLeft className="h-4 w-4 text-foreground" />
          </button>
          <div className="text-center min-w-[140px]">
            <div className="text-xs font-semibold text-foreground">{currentPattern.name}</div>
            <div className="text-[10px] text-muted-foreground">{currentPattern.description}</div>
            <div className="flex gap-1 justify-center mt-1">
              {networkPatterns.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1 w-1 rounded-full transition-all ${
                    idx === currentPatternIndex
                      ? "bg-primary w-3"
                      : "bg-muted-foreground/40"
                  }`}
                />
              ))}
            </div>
          </div>
          <button
            onClick={nextPattern}
            className="p-1 hover:bg-accent rounded transition-colors"
            aria-label="Siguiente patrón"
          >
            <ChevronRight className="h-4 w-4 text-foreground" />
          </button>
        </div>
        )}

        <div
          className="relative w-[250px] h-[250px] rounded-full overflow-visible transition-all duration-500"
          style={{
            filter: contrastMode === 'light' 
              ? 'brightness(1.8) contrast(1.2) invert(1)' 
              : contrastMode === 'dark' 
              ? 'brightness(0.3) contrast(1.5)' 
              : 'none',
          }}
        >
          {/* Planet background layer - non-interactive */}
          <div
            className={cn(
              "absolute inset-0 rounded-full overflow-hidden pointer-events-none transition-all duration-500",
              // Original shadow effects for all modes
              "shadow-[0_0_20px_rgba(255,255,255,0.2),-5px_0_8px_#c3f4ff_inset,15px_2px_25px_#000_inset,-24px_-2px_34px_#c3f4ff99_inset,250px_0_44px_#00000066_inset,150px_0_38px_#000000aa_inset]"
            )}
            style={{
              backgroundImage: `url(${globeImage})`,
              backgroundSize: "cover",
              backgroundPosition: "left",
              // Original rotation: normal (left to right) for all modes
              animation: "earthRotate 30s linear infinite",
              zIndex: 1,
              willChange: "background-position",
              backfaceVisibility: "hidden",
            }}
          />            
          {/* Dynamic Energy Network Nodes - Hidden in all modes */}
          {false && (
            <div
              key={currentPattern.id}
              className="absolute inset-0"
              style={{
                animation: isTransitioning 
                  ? "patternEvolve 1s ease-in-out" 
                  : "patternFadeIn 0.8s ease-out, networkEvolve 4s ease-in-out infinite",
                zIndex: 20,
                transition: 'opacity 0.8s ease-in-out',
              }}
            >
            {currentPattern.nodes.map((node, index) => (
              <div
                key={`node-${index}`}
                className="absolute rounded-full transition-all group"
                style={{
                  top: node.top,
                  left: node.left,
                  width: '16px',
                  height: '16px',
                  transform: 'translate(-50%, -50%)',
                  zIndex: 30,
                  animation: `patternFadeIn ${0.5 + index * 0.1}s ease-out`,
                }}
              >
                {/* Hover glow ring */}
                <div
                  className="absolute inset-0 rounded-full border border-orange-400/0 group-hover:border-orange-400/60 transition-all"
                  style={{
                    top: '50%',
                    left: '50%',
                    width: '14px',
                    height: '14px',
                    transform: 'translate(-50%, -50%)',
                  }}
                />
                {/* Node core */}
                <div
                  className="absolute w-1.5 h-1.5 rounded-full node-core"
                  style={{
                    top: '50%',
                    left: '50%',
                    background: 'radial-gradient(circle, #f4721e 0%, #e55a00 50%, transparent 100%)',
                    animation: `energyPulse ${2 + node.pulseDelay}s infinite`,
                    animationDelay: `${node.pulseDelay}s`,
                    boxShadow: '0 0 6px #f4721e, 0 0 12px #f4721e, 0 0 18px #f4721e, 0 0 24px rgba(244, 114, 30, 0.4)',
                    transform: 'translate(-50%, -50%)',
                    filter: 'drop-shadow(0 0 2px rgba(244, 114, 30, 0.8))',
                    pointerEvents: 'none',
                  }}
                >
                  {/* Inner glow effect */}
                  <div 
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: 'radial-gradient(circle, rgba(255, 255, 255, 0.4) 0%, transparent 70%)',
                      animation: `energyPulse ${2 + node.pulseDelay}s infinite`,
                      animationDelay: `${node.pulseDelay + 0.1}s`,
                    }}
                  />
                </div>
              </div>
            ))}
            </div>
          )}

          {/* Dynamic Energy Network Lines - Improved with better curves - Hidden in all modes */}
          {false && (
          <svg 
            className="absolute inset-0 w-full h-full" 
            style={{ 
              zIndex: 15,
              animation: isTransitioning 
                ? "patternEvolve 1s ease-in-out" 
                : "patternFadeIn 0.8s ease-out",
              transition: 'opacity 0.8s ease-in-out',
            }}
            key={`svg-${currentPattern.id}`}
          >
            <defs>
              <linearGradient id={`energyGradient-${currentPattern.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f4721e" stopOpacity="0.9" />
                <stop offset="50%" stopColor="#e55a00" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#f4721e" stopOpacity="0.9" />
              </linearGradient>
              <filter id={`glow-${currentPattern.id}`}>
                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            {currentPattern.paths.map((path, index) => (
              <g key={`path-group-${index}`}>
                {/* Visible path */}
                <path
                  d={path.d}
                  stroke={`url(#energyGradient-${currentPattern.id})`}
                  strokeWidth="1"
                  fill="none"
                  strokeDasharray="4,3"
                  style={{
                    animation: `energyFlow ${path.flowDuration}s linear infinite, networkEvolve ${3 + path.delay}s ease-in-out infinite`,
                    animationDelay: `${path.delay}s`,
                    filter: `drop-shadow(0 0 2px #f4721e) drop-shadow(0 0 4px rgba(244, 114, 30, 0.5))`,
                    opacity: 0.85,
                    pointerEvents: 'none',
                  }}
                />
              </g>
            ))}
          </svg>
          )}

          {/* Enhanced Orbital Energy Rings - Multiple layers for depth - Only show in Celsia mode */}
          {isCelsiaMode && (
          <>
          <div 
            className="absolute inset-[-20px] rounded-full border border-orange-500/30 pointer-events-none"
            style={{
              animation: "orbitRotate 20s linear infinite",
              boxShadow: "0 0 20px rgba(244, 114, 30, 0.3), inset 0 0 20px rgba(244, 114, 30, 0.1)",
              zIndex: 1,
            }}
          />
          <div 
            className="absolute inset-[-30px] rounded-full border border-orange-500/20 pointer-events-none"
            style={{
              animation: "orbitRotate 30s linear infinite reverse",
              boxShadow: "0 0 15px rgba(244, 114, 30, 0.2)",
              zIndex: 1,
            }}
          />
          <div 
            className="absolute inset-[-10px] rounded-full border border-orange-500/40 pointer-events-none"
            style={{
              animation: "orbitRotate 15s linear infinite",
              boxShadow: "0 0 10px rgba(244, 114, 30, 0.4)",
              zIndex: 1,
            }}
          />

          {/* Stars - Only show in Celsia mode */}
          <div
            className="absolute left-[-20px] w-1 h-1 bg-white rounded-full pointer-events-none"
            style={{ animation: "twinkling 3s infinite", zIndex: 1 }}
          />
          <div
            className="absolute left-[-40px] top-[30px] w-1 h-1 bg-white rounded-full pointer-events-none"
            style={{ animation: "twinkling-slow 2s infinite", zIndex: 1 }}
          />
          <div
            className="absolute left-[350px] top-[90px] w-1 h-1 bg-white rounded-full pointer-events-none"
            style={{ animation: "twinkling-long 4s infinite", zIndex: 1 }}
          />
          <div
            className="absolute left-[200px] top-[290px] w-1 h-1 bg-white rounded-full pointer-events-none"
            style={{ animation: "twinkling 3s infinite", zIndex: 1 }}
          />
          <div
            className="absolute left-[50px] top-[270px] w-1 h-1 bg-white rounded-full pointer-events-none"
            style={{ animation: "twinkling-fast 1.5s infinite", zIndex: 1 }}
          />
          <div
            className="absolute left-[250px] top-[-50px] w-1 h-1 bg-white rounded-full pointer-events-none"
            style={{ animation: "twinkling-long 4s infinite", zIndex: 1 }}
          />
          <div
            className="absolute left-[290px] top-[60px] w-1 h-1 bg-white rounded-full pointer-events-none"
            style={{ animation: "twinkling-slow 2s infinite", zIndex: 1 }}
          />
          </>
          )}
        </div>
      </div>
    </>
  );
};

export default Globe;