"use client";
import React, { useMemo, useState } from "react";
import {
  Bell,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ClipboardCheck,
  Download,
  Moon,
  Sparkles,
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
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${tones[tone]}`}>
      {children}
    </span>
  );
}

function SectionCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-3xl bg-white shadow-sm ring-1 ring-slate-200 ${className}`}>{children}</div>;
}

function fmtCOP(n: number) {
  try {
    return new Intl.NumberFormat("es-CO", { maximumFractionDigits: 0 }).format(Math.round(n));
  } catch {
    return String(Math.round(n));
  }
}

function fmtKWh(n: number) {
  try {
    return new Intl.NumberFormat("es-CO", { maximumFractionDigits: 0 }).format(Math.round(n));
  } catch {
    return String(Math.round(n));
  }
}

function MiniKpi({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-3xl bg-slate-50 p-4 ring-1 ring-slate-200">
      <div className="text-[11px] font-semibold text-slate-500">{label}</div>
      <div className="mt-1 text-xl font-bold text-slate-900">{value}</div>
      {sub ? <div className="mt-1 text-xs text-slate-500">{sub}</div> : null}
    </div>
  );
}

function BarRow({ label, pct, note }: { label: string; pct: number; note?: string }) {
  const width = Math.max(4, Math.min(100, pct));
  return (
    <div className="flex items-center gap-3">
      <div className="w-14 text-xs font-semibold text-slate-600">{label}</div>
      <div className="flex-1">
        <div className="h-2 rounded-full bg-slate-100 ring-1 ring-slate-200 overflow-hidden">
          <div className="h-full rounded-full bg-orange-500/70" style={{ width: `${width}%` }} />
        </div>
      </div>
      <div className="w-12 text-right text-xs font-semibold text-slate-700">{Math.round(pct)}%</div>
      {note ? <div className="hidden md:block text-xs text-slate-500 w-52">{note}</div> : null}
    </div>
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

function SelectMonth({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-2xl bg-white px-3 py-2 shadow-sm ring-1 ring-slate-200">
      <Calendar className="h-4 w-4 text-orange-600" />
      <select value={value} onChange={(e) => onChange(e.target.value)} className="bg-transparent text-sm font-semibold text-slate-800 outline-none">
        <option value="2026-02">Febrero 2026</option>
        <option value="2026-01">Enero 2026</option>
        <option value="2025-12">Diciembre 2025</option>
      </select>
      <ChevronDown className="h-4 w-4 text-slate-400" />
    </div>
  );
}

export default function MockupFueraDeHorario() {
  const [month, setMonth] = useState("2026-02");

  // Mock data (coherente con lo que ya veníamos usando)
  const data = useMemo(() => {
    const outsidePct = 14; // % del mes fuera de horario
    const monthKwh = 9800;
    const outsideKwh = Math.round(monthKwh * (outsidePct / 100));
    const copPerKwh = 633;
    const outsideCOP = outsideKwh * copPerKwh;

    const nights = [
      { date: "Mié 05", kwh: 62, afterClose: 48, note: "Actividad constante 22:00–02:00" },
      { date: "Vie 07", kwh: 58, afterClose: 41, note: "Refrigeración/stand-by" },
      { date: "Lun 10", kwh: 55, afterClose: 39, note: "Luces/aire" },
      { date: "Jue 13", kwh: 53, afterClose: 36, note: "Compresor" },
      { date: "Sáb 15", kwh: 49, afterClose: 31, note: "Fin de semana no baja" },
    ];

    const hours = [
      { h: "22:00", p: 68 },
      { h: "23:00", p: 76 },
      { h: "00:00", p: 82 },
      { h: "01:00", p: 79 },
      { h: "02:00", p: 71 },
      { h: "03:00", p: 56 },
      { h: "04:00", p: 44 },
      { h: "05:00", p: 35 },
    ];

    // ahorro potencial sobre el consumo fuera de horario
    const saveLow = Math.round(outsideKwh * 0.15);
    const saveHigh = Math.round(outsideKwh * 0.30);

    return {
      outsidePct,
      monthKwh,
      outsideKwh,
      outsideCOP,
      copPerKwh,
      nights,
      hours,
      saveLow,
      saveHigh,
    };
  }, [month]);

  return (
    <div className="min-h-screen bg-gradient-to-b  to-white p-6 text-slate-900">
      <div className="w-full space-y-5">
        {/* HEADER */}
        <SectionCard className="overflow-hidden border-t-4 border-orange-200">
          <div className="bg-gradient-to-r from-orange-50 via-white to-white p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-700 ring-1 ring-orange-200/80">
                  <Moon className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-500">Detalle · Eco-feedback</div>
                  <div className="mt-1 text-2xl font-bold tracking-tight text-slate-900">Consumo fuera de horario</div>
                  <div className="mt-1 text-sm text-slate-600">Evidencia + acción rápida (sin tecnicismos).</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <SelectMonth value={month} onChange={setMonth} />
                <button className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50">
                  <Download className="h-4 w-4" />
                  Descargar
                </button>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <Pill tone="orange">
                <Sparkles className="h-3.5 w-3.5" />
                Oportunidad prioritaria
              </Pill>
              <Pill tone="slate">
                <Zap className="h-3.5 w-3.5 text-orange-600" />
                Lectura automática
              </Pill>
            </div>
          </div>
        </SectionCard>

        {/* KPIs */}
        <SectionCard className="p-5 border-t-4 border-orange-200">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="text-xs font-semibold text-slate-500">Resumen ejecutivo (mockup)</div>
              <div className="mt-1 text-lg font-bold text-slate-900">Qué tanto ocurre fuera de horario</div>
            </div>
            <Pill tone="slate">
              <Moon className="h-3.5 w-3.5 text-orange-600" />
              Fuera de horario
            </Pill>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
            <MiniKpi label="Fuera de horario" value={`~${data.outsidePct}%`} sub="Del consumo mensual" />
            <MiniKpi label="kWh fuera de horario" value={`${fmtKWh(data.outsideKwh)} kWh`} sub="Aproximación" />
            <MiniKpi label="Costo asociado" value={`$ ${fmtCOP(data.outsideCOP)}`} sub="COP (referencia)" />
            <MiniKpi
              label="Ahorro potencial"
              value={`${fmtKWh(data.saveLow)}–${fmtKWh(data.saveHigh)} kWh`}
              sub="Si reduces 15–30%"
            />
          </div>

          <div className="mt-3 text-[11px] text-slate-500">Valores ilustrativos del mockup. Se ajustan con datos reales.</div>
        </SectionCard>

        {/* CONTENIDO */}
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.2fr_0.8fr]">
          {/* Evidencia */}
          <SectionCard className="p-5">
            <div className="flex items-center justify-between gap-3">
              <div className="text-lg font-bold text-slate-900">Evidencia rápida</div>
              <Pill tone="slate">
                <Sparkles className="h-3.5 w-3.5 text-orange-600" />
                Noches y horas
              </Pill>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
              <div className="rounded-3xl bg-slate-50 p-4 ring-1 ring-slate-200">
                <div className="text-sm font-semibold text-slate-900">Noches destacadas</div>
                <div className="mt-3 space-y-3">
                  {data.nights.map((n) => (
                    <div key={n.date} className="rounded-3xl bg-white p-4 ring-1 ring-slate-200">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-sm font-semibold text-slate-900">{n.date}</div>
                          <div className="mt-1 text-xs text-slate-500">{n.note}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs font-semibold text-slate-500">kWh noche</div>
                          <div className="mt-1 text-base font-bold text-slate-900">{fmtKWh(n.kwh)}</div>
                          <div className="mt-1 text-xs text-slate-500">Tras cierre: {fmtKWh(n.afterClose)}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl bg-slate-50 p-4 ring-1 ring-slate-200">
                <div className="text-sm font-semibold text-slate-900">Horas con mayor actividad (fuera de horario)</div>
                <div className="mt-3 space-y-3">
                  {data.hours.map((h) => (
                    <BarRow key={h.h} label={h.h} pct={h.p} note={h.p >= 70 ? "Zona crítica" : h.p >= 50 ? "A revisar" : "Menor"} />
                  ))}
                </div>
                <div className="mt-4 rounded-3xl bg-white p-4 ring-1 ring-slate-200">
                  <div className="text-sm font-semibold text-slate-900">Lectura</div>
                  <div className="mt-2 text-[13px] leading-relaxed text-slate-700">
                    El mayor consumo se concentra entre <span className="font-semibold">23:00 y 02:00</span>. Si tu operación ya cerró, este bloque suele venir de refrigeración, aire, iluminación o equipos en stand-by.
                  </div>
                </div>
              </div>
            </div>
          </SectionCard>

          {/* Acción */}
          <SectionCard className="p-5 border-t-4 border-orange-200">
            <div className="flex items-center gap-3">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-orange-100 text-orange-700 ring-1 ring-orange-200/80">
                <ClipboardCheck className="h-5 w-5" />
              </div>
              <div>
                <div className="text-lg font-bold text-slate-900">Qué haría primero</div>
                <div className="mt-1 text-sm text-slate-600">Un plan corto para resolver rápido.</div>
              </div>
            </div>

            <div className="mt-4 rounded-3xl bg-orange-50/70 p-4 ring-1 ring-orange-200/80">
              <div className="flex items-start gap-2">
                <Zap className="mt-0.5 h-4 w-4 shrink-0 text-orange-700" />
                <p className="text-sm leading-relaxed text-slate-700">
                  Prioridad: lograr que el consumo <span className="font-semibold text-slate-900">baje después del cierre</span>. Es la forma más rápida de reducir el fuera de horario sin tocar la operación.
                </p>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              <ActionItem
                number="1"
                title="Rutina de cierre (3–5 min)"
                body="Checklist: iluminación, aire, refrigeración, compresores y stand-by. Si aplica, define responsable y hora de verificación."
              />
              <ActionItem
                number="2"
                title="Crear alerta fuera de horario"
                body="Notificación si el consumo no baja 30–60 min después del cierre (o si supera tu umbral nocturno)."
              />
              <ActionItem
                number="3"
                title="Confirmar una noche"
                body="Elige una de las ‘Noches destacadas’ y valida qué equipos estaban encendidos. Con una noche confirmada, se corrige rápido."
              />
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <button className="inline-flex items-center gap-2 rounded-2xl bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-700">
                <Bell className="h-4 w-4" />
                Crear alerta
              </button>
              <button className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-50">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                Descargar checklist
              </button>
            </div>

            <div className="mt-4 rounded-3xl bg-white p-4 ring-1 ring-slate-200">
              <div className="text-sm font-semibold text-slate-900">Regla de alerta (mockup)</div>
              <div className="mt-2 flex flex-wrap gap-2">
                <Pill tone="orange">Ventana: 22:00–05:00</Pill>
                <Pill tone="slate">Condición: no baja tras cierre</Pill>
                <Pill tone="slate">Canal: correo / WhatsApp</Pill>
              </div>
              <div className="mt-2 text-[13px] leading-relaxed text-slate-700">
                Ejemplo: notificar si el consumo se mantiene por encima del patrón habitual durante 2 noches seguidas.
              </div>
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}