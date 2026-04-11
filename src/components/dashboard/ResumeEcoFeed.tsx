"use client";
import React from "react";
import {
  AlertTriangle,
  Bell,
  CheckCircle2,
  CircleHelp,
  ClipboardCheck,
  Download,
  Lightbulb,
  Moon,
  Sparkles,
  Sun,
  TrendingUp,
  Zap,
} from "lucide-react";

function Pill({
  children,
  tone = "slate",
}: {
  children: React.ReactNode;
  tone?: "slate" | "orange" | "red" | "green";
}) {
  const tones: Record<string, string> = {
    slate: "bg-slate-50 text-slate-700 ring-slate-200",
    orange: "bg-orange-50 text-orange-700 ring-orange-200",
    red: "bg-red-50 text-red-700 ring-red-200",
    green: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${
        tones[tone]
      }`}
    >
      {children}
    </span>
  );
}

function SectionCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-3xl bg-white shadow-sm ring-1 ring-slate-200 ${className}`}
    >
      {children}
    </div>
  );
}

function DriverCard({
  icon,
  title,
  impact,
  tone,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  impact: string;
  tone: "orange" | "red" | "green" | "slate";
  body: string;
}) {
  return (
    <SectionCard className="p-4 border-t-4 border-orange-200">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-orange-100 text-orange-700 ring-1 ring-orange-200/80">
            {icon}
          </div>
          <div className="min-w-0">
            <div className="text-base font-semibold text-slate-900">{title}</div>
            <div className="mt-2">
              <Pill tone={tone}>{impact}</Pill>
            </div>
          </div>
        </div>
      </div>
      <p className="mt-3 text-[13px] leading-relaxed text-slate-700">{body}</p>
    </SectionCard>
  );
}

function ActionItem({
  number,
  title,
  body,
}: {
  number: string;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-3xl bg-white p-4 ring-1 ring-slate-200">
      <div className="text-sm font-semibold text-slate-900">
        {number}) {title}
      </div>
      <p className="mt-2 text-[13px] leading-relaxed text-slate-700">{body}</p>
    </div>
  );
}

export default function MockupResumenEcoFeed() {
  const hallazgo = {
    titulo: "Tu principal oportunidad está en el consumo fuera de horario.",
    texto:
      "El patrón sugiere consumo relevante cuando el negocio debería estar en mínimo. Si tu operación no es nocturna, la mejora más rápida es fortalecer el cierre diario y controlar equipos que quedan en stand-by.",
  };

  const drivers = [
    {
      title: "Consumo fuera de horario",
      impact: "Impacto alto",
      tone: "red" as const,
      icon: <Moon className="h-5 w-5" />,
      body:
        "El consumo no baja después del cierre. Acción rápida: revisar iluminación, aire, refrigeración, compresores y equipos en stand-by.",
    },
    {
      title: "Picos puntuales",
      impact: "Impacto medio",
      tone: "orange" as const,
      icon: <Zap className="h-5 w-5" />,
      body:
        "Se ven picos en momentos específicos. Acción rápida: identificar 1–2 equipos y validar su uso en el día pico.",
    },
    {
      title: "Más horas activas",
      impact: "Impacto medio",
      tone: "orange" as const,
      icon: <Sun className="h-5 w-5" />,
      body:
        "Sube por más tiempo encendido (turnos/jornadas). Acción rápida: confirmar horarios y rutina de apagado.",
    },
  ];

  const acciones = [
    {
      number: "1",
      title: "Revisar cierre diario",
      body:
        "Checklist (3–5 min): iluminación, aire, refrigeración, compresores y stand-by. Objetivo: que el consumo baje tras el cierre.",
    },
    {
      number: "2",
      title: "Activar alerta fuera de horario",
      body:
        "Alerta nocturna: avisar si el consumo no baja 30–60 min después del cierre. Te ayuda a detectar la causa el mismo día.",
    },
    {
      number: "3",
      title: "Revisar el día pico",
      body:
        "Día pico: compara qué cambió vs un día normal (turnos, arranques, eventos). Si no coincide con operación, suele ser un equipo.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b  to-white p-6 text-slate-900">
      <div className="w-full space-y-5">
        {/* RESUMEN EJECUTIVO */}
        <SectionCard className="overflow-hidden border-t-4 border-orange-200">
          <div className="bg-gradient-to-r from-orange-50 via-white to-white p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-700 ring-1 ring-orange-200/80">
                  <Sparkles className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-xs text-slate-400">Resumen ejecutivo (mockup)</div>
                  <div className="mt-1 text-2xl font-bold tracking-tight text-slate-900">Consumo y costo del mes</div>
                  <div className="mt-1 text-sm text-slate-600">KPIs clave para conversación con gerencia.</div>
                </div>
              </div>

              <Pill tone="slate">
                <Sparkles className="h-3.5 w-3.5 text-orange-600" />
                Ejecutivo
              </Pill>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
              <div className="rounded-3xl bg-white/80 p-4 ring-1 ring-slate-200">
                <div className="text-[11px] font-semibold text-slate-500">Consumo</div>
                <div className="mt-1 text-2xl font-bold text-slate-900">9.8 MWh</div>
                <div className="mt-1 text-xs text-slate-500">Acumulado del mes</div>
              </div>
              <div className="rounded-3xl bg-white/80 p-4 ring-1 ring-slate-200">
                <div className="text-[11px] font-semibold text-slate-500">Costo estimado</div>
                <div className="mt-1 text-2xl font-bold text-slate-900">$ 6.2 M</div>
                <div className="mt-1 text-xs text-slate-500">COP (referencia)</div>
              </div>
              <div className="rounded-3xl bg-white/80 p-4 ring-1 ring-slate-200">
                <div className="text-[11px] font-semibold text-slate-500">Vs mes anterior</div>
                <div className="mt-1 text-2xl font-bold text-slate-900">+7.5%</div>
                <div className="mt-1 text-xs text-slate-500">Cambio mensual</div>
              </div>
              <div className="rounded-3xl bg-white/80 p-4 ring-1 ring-slate-200">
                <div className="text-[11px] font-semibold text-slate-500">Impacto estimado</div>
                <div className="mt-1 text-2xl font-bold text-slate-900">+$ 0.4 M</div>
                <div className="mt-1 text-xs text-slate-500">Aproximación</div>
              </div>
            </div>

            <div className="mt-3 text-[11px] text-slate-500">Valores ilustrativos del mockup. Se ajustan con datos reales.</div>
          </div>
        </SectionCard>

        {/* HALLAZGO PRINCIPAL */}
        <SectionCard className="overflow-hidden border-t-4 border-orange-200">
          <div className="bg-gradient-to-r from-orange-50 via-white to-white p-5">
            <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
              <div className="min-w-0">

                <h2 className="mt-4 text-3xl font-bold leading-tight text-slate-900 sm:text-2xl">{hallazgo.titulo}</h2>
                <p className="mt-3 text-base leading-relaxed text-slate-700">{hallazgo.texto}</p>
              </div>

              <div className="rounded-3xl bg-white p-4 ring-1 ring-slate-200">
                <div className="text-sm font-semibold text-slate-600">Acción recomendada</div>
                <div className="mt-3 flex items-center gap-2 text-base font-semibold text-slate-900">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  Cierre diario + alerta fuera de horario
                </div>
                <p className="mt-3 text-base leading-relaxed text-slate-700">
                  Prioridad: bajar consumo fuera de horario sin afectar la operación. Después, revisar picos puntuales si persisten.
                </p>
              </div>
            </div>
          </div>
        </SectionCard>

        {/* BLOQUES DE VALOR */}
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[0.8fr_0.8fr]">
          <SectionCard className="p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-lg font-bold text-slate-900">Qué detectamos</div>
                
              </div>
              <Pill tone="slate">
                <Sparkles className="h-3.5 w-3.5 text-orange-600" />
                Lectura automática
              </Pill>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
              {drivers.map((d) => (
                <DriverCard key={d.title} {...d} />
              ))}
            </div>
          </SectionCard>

          <SectionCard className="p-5 border-t-4 border-orange-200">
            <div className="flex items-center gap-3">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-orange-100 text-orange-700 ring-1 ring-orange-200/80">
                <ClipboardCheck className="h-5 w-5" />
              </div>
              <div>
                <div className="text-lg font-bold text-slate-900">Qué haría primero</div>
                
              </div>
            </div>

            <div className="mt-4 rounded-3xl bg-orange-50/70 p-4 ring-1 ring-orange-200/80">
              <div className="flex items-start gap-2">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-orange-700" />
                <p className="text-sm leading-relaxed text-slate-700">
                  Empieza por una sola cosa: <span className="font-semibold text-slate-900">rutina de cierre</span>. Es lo que más rápido corrige el consumo fuera de horario sin tocar la operación principal.
                </p>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {acciones.map((a) => (
                <ActionItem key={a.number} {...a} />
              ))}
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <button className="inline-flex items-center gap-2 rounded-2xl bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-700">
                <Bell className="h-4 w-4" />
                Crear alerta
              </button>
              <button className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-50">
                <Download className="h-4 w-4" />
                Descargar checklist
              </button>
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}