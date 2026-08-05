"use client";
import React, { useMemo, useState } from "react";
import {
  Bell,
  Calendar,
  ChevronDown,
  CircleHelp,
  Download,
  Gauge,
  Leaf,
  LineChart,
  Moon,
  Sparkles,
  Sun,
  Zap,
} from "lucide-react";
import {
  BarChart as RBarChart,
  Bar,
  Cell,
  ReferenceLine,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

// Mockup Web - 5.2.2 Eco-feedback (Solo Gadgets 2 y 3)
// Estilo Tarifa + lecturas automáticas (sin tecnicismos).

function getMonthLabel(key: string) {
  const map: Record<string, string> = {
    "2026-02": "Febrero 2026",
    "2026-01": "Enero 2026",
    "2025-12": "Diciembre 2025",
  };
  return map[key] || key;
}

function monthKeyToShortLabel(key: string) {
  const parts = String(key || "").split("-");
  const yy = parts[0] || "";
  const mm = parts[1] || "";
  const mMap = {
    "01": "Ene",
    "02": "Feb",
    "03": "Mar",
    "04": "Abr",
    "05": "May",
    "06": "Jun",
    "07": "Jul",
    "08": "Ago",
    "09": "Sep",
    "10": "Oct",
    "11": "Nov",
    "12": "Dic",
  };
  const m = mMap[mm as keyof typeof mMap] || mm;
const y2 = yy ? yy.slice(-2) : "";

return `${m}-${y2}`;
}

function fmt0(n: number | string) {
  try {
    return new Intl.NumberFormat("es-CO", { maximumFractionDigits: 0 }).format(Math.round(Number(n || 0)));
  } catch {
    return String(Math.round(Number(n || 0)));
  }
}

function pct(a: number | string, b: number | string) {
  const bb = Number(b || 0);
  if (!bb) return 0;
  return (Number(a || 0) / bb - 1) * 100;
}

function monthFull(m: string) {
  const map: Record<string, string> = {
    Dic: "Diciembre",
    Ene: "Enero",
    Feb: "Febrero",
  };

  return map[m] || m || "";
}

function buildTrend(mode: string): TrendData[] {
  // DÍA: 30 días (semana estable, fin de semana baja)
  if (mode === "dia") {
    const baseWeek = 155;
    const baseWeekend = 95;

    return Array.from({ length: 30 }, (_, i) => {
      const d = i + 1;
      const dow = i % 7; // día 1 = lunes
      const isWeekend = dow === 5 || dow === 6;

      const seasonal = 6 * Math.sin(d / 5);
      const noise = (((d * 7) % 11) - 5) * 1.2; // determinístico
      const kwh = Math.round((isWeekend ? baseWeekend : baseWeek) + seasonal + noise);

      return { x: String(d), kwh };
    });
  }

  // SEMANA: 3 meses (12 semanas) + gaps reales entre meses
  if (mode === "semana") {
    const series = [
      { m: "Dic", base: 960 },
      { m: "Ene", base: 905 },
      { m: "Feb", base: 940 },
    ];

    const out: {
  x: string;
  kwh: number | null;
  month?: string;
  week?: number;
  isGap: boolean;
}[] = [];
    series.forEach((mm, idx) => {
      for (let w = 1; w <= 4; w++) {
        const drift = 18 * Math.sin((w + 1) / 2.2);
        const noise = ((((w + 3) * 9 + idx * 5) % 13) - 6) * 3;
        const kwh = Math.round(mm.base + drift + noise);
        out.push({ x: `${mm.m} S${w}`, kwh, month: mm.m, week: w, isGap: false });
      }
      if (idx < series.length - 1) out.push({ x: `__gap_${mm.m}_${series[idx + 1].m}`, kwh: null, isGap: true });
    });

    return out;
  }

  // MES: 2025 completo + 2026 (Ene–Feb) + gap cambio de año
  const y2025 = [
    { x: "Ene-25", v: 9400 },
    { x: "Feb-25", v: 9200 },
    { x: "Mar-25", v: 9600 },
    { x: "Abr-25", v: 9800 },
    { x: "May-25", v: 10200 },
    { x: "Jun-25", v: 10800 },
    { x: "Jul-25", v: 11000 },
    { x: "Ago-25", v: 10700 },
    { x: "Sep-25", v: 10100 },
    { x: "Oct-25", v: 9900 },
    { x: "Nov-25", v: 9700 },
    { x: "Dic-25", v: 9300 },
  ];
  const y2026 = [
    { x: "Ene-26", v: 9500 },
    { x: "Feb-26", v: 9800 },
  ];

  const out = [];
  y2025.forEach((m, i) => {
    const noise = (((i + 2) * 37) % 9 - 4) * 35;
    out.push({ x: m.x, kwh: Math.round(m.v + noise), year: 2025, isGap: false });
  });
  out.push({ x: "__gap_year_25_26", kwh: null, year: 0, isGap: true });
  y2026.forEach((m, i) => {
    const noise = (((i + 7) * 31) % 9 - 4) * 35;
    out.push({ x: m.x, kwh: Math.round(m.v + noise), year: 2026, isGap: false });
  });
  return out;
}

function buildHeatmap() {
  const rows = 24;
  const cols = 7;
  const out = [];

  for (let h = 0; h < rows; h++) {
    const row = [];
    for (let d = 0; d < cols; d++) {
      const work = Math.max(0, 1 - Math.abs(h - 13) / 6);
      const base = 0.10 + 0.03 * (0.5 + 0.5 * Math.sin((h + 1) * (d + 3)));
      const weekend = d === 6 ? 0.55 : 1;
      const nightPenalty = h <= 5 || h >= 22 ? 0.65 : 1;
      const v = Math.max(0, Math.min(1, base + 0.70 * work * weekend * nightPenalty));
      row.push(v);
    }
    out.push(row);
  }
  return out;
}

type PillProps = {
  children: React.ReactNode;
  tone?: "orange" | "green" | "red" | "slate";
};

function Pill({ children,  tone }: PillProps) {
  const t = tone || "slate";
  const cls =
    t === "orange"
      ? "bg-orange-50 text-orange-700 ring-orange-200"
      : t === "green"
      ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
      : t === "red"
      ? "bg-red-50 text-red-700 ring-red-200"
      : "bg-slate-50 text-slate-700 ring-slate-200";
  return <span className={"inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ring-1 " + cls}>{children}</span>;
}

type CardProps = {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  right?: React.ReactNode;
  children?: React.ReactNode;
};

function Card({ title, subtitle, icon, right, children }: CardProps) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 border-t-4 border-orange-200">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            {icon ? (
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-orange-100 text-orange-700 ring-1 ring-orange-200/70">
                {icon}
              </span>
            ) : null}
            <div className="min-w-0">
              <div className="text-sm font-semibold text-slate-900 truncate">{title}</div>
              {subtitle ? <div className="mt-0.5 text-xs text-slate-600">{subtitle}</div> : null}
            </div>
          </div>
        </div>
        {right ? <div className="shrink-0">{right}</div> : null}
      </div>
      <div className="mt-4">{children}</div>
    </div>
  );
}

type SelectMonthProps = {
  value: string;
  onChange: (value: string) => void;
};

function SelectMonth({ value, onChange }: SelectMonthProps) {
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

type HeaderProps = {
  month: string;
  setMonth: (month: string) => void;
};

function Header({ month, setMonth }: HeaderProps) {
  const label = getMonthLabel(month);

  return (
    <div className="flex justify-end mb-3">

      <div className="flex items-center gap-3">
        <SelectMonth value={month} onChange={setMonth} />

        <button className="rounded-2xl bg-orange-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-700">
          <Download className="h-4 w-4 inline-block mr-2" />
          Descargar
        </button>
      </div>

    </div>
  );
}

type TooltipBoxProps = {
  label: string;
  value: number | string;
  unit: string;
};

function TooltipBox({ label, value, unit }: TooltipBoxProps) {
  return (
    <div className="rounded-2xl bg-white p-3 text-xs ring-1 ring-orange-200/70 shadow-sm">
      <div className="font-semibold text-slate-900">{label}</div>
      <div className="mt-1 text-slate-700">
        {value} {unit}
      </div>
    </div>
  );
}

type MiniNoteProps = {
  icon?: React.ReactNode;
  title?: string;
  body?: string;
};

function MiniNote({ icon, title, body }: MiniNoteProps) {
  return (
    <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200 border-t-4 border-orange-200">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-orange-100 text-orange-700 ring-1 ring-orange-200/70">
          {icon}
        </div>
        <div className="min-w-0">
          <div className="text-sm font-semibold text-slate-900">{title}</div>
          <div className="mt-1.5 text-sm leading-relaxed text-slate-700">{body}</div>
        </div>
      </div>
    </div>
  );
}

type TrendData = {
  x: string
  kwh: number | null
  month?: string
  week?: number
  year?: number
  isGap?: boolean
}

function deriveInsights(
  mode: string,
  data: TrendData[],
  selectedMonthKey: string
) {
  const clean: TrendData[] = (data || []).filter((d) => d && !d.isGap && typeof d.kwh === "number" && !Number.isNaN(d.kwh));
  if (!clean.length) {
    return [
      { title: "Lectura", body: "No hay datos suficientes para generar una lectura." },
      { title: "", body: "" },
      { title: "", body: "" },
    ];
  }

  const max = clean.reduce((a, b) => ((b.kwh as number) > (a.kwh as number) ? b : a), clean[0]);
const min = clean.reduce((a, b) => ((b.kwh as number) < (a.kwh as number) ? b : a), clean[0]);

  // DÍA
  if (mode === "dia") {
    const weekdays: number[] = [];
    const weekends: number[] = [];

    let weekendMaxObj: TrendData | null = null;
    
    clean.forEach((d: TrendData) => {
      const day = Number(d.x);
      const dow = (day - 1) % 7;
      const isWeekend = dow === 5 || dow === 6;
      (isWeekend ? weekends : weekdays).push(d.kwh as number);
      if (isWeekend) {
  if (weekendMaxObj === null || (d.kwh as number) > (weekendMaxObj.kwh as number)) {
  weekendMaxObj = d;
}
}
    });

    const avgW = weekdays.length ? weekdays.reduce((s, v) => s + v, 0) / weekdays.length : 0;
    const avgWE = weekends.length ? weekends.reduce((s, v) => s + v, 0) / weekends.length : 0;
    const weekendVsWeek = pct(avgWE, avgW);

    // Mes vs año anterior (usando la serie mensual del mockup)
    const ms = (buildTrend("mes") as TrendData[]).filter(
  (d) => d && !d.isGap && typeof d.kwh === "number"
);
    const curKey = monthKeyToShortLabel(selectedMonthKey);
    const parts = String(curKey).split("-");
    const mon = parts[0];
    const yy = Number(parts[1]);
    const prevKey = mon + "-" + String(yy - 1).padStart(2, "0");

    const currentM: TrendData =
  ms.find((d: TrendData) => d.x === curKey) || ms[ms.length - 1];

const priorM: TrendData | null =
  ms.find((d: TrendData) => d.x === prevKey) || null;

    const yoyPct = priorM ? pct(currentM.kwh as number, priorM.kwh as number) : 0;
    const yoyAbs = priorM ? (currentM.kwh as number) - (priorM.kwh as number) : 0;

    const body1 =
      `Entre semana estás en ~${fmt0(avgW)} kWh/día y en fin de semana ` +
      (weekendVsWeek < 0 ? `bajas ~${Math.round(Math.abs(weekendVsWeek))}%` : `subes ~${Math.round(Math.abs(weekendVsWeek))}%`) +
      ".";

    let weekendText = "";

if (weekendMaxObj) {
  const w = weekendMaxObj as TrendData;

  const day = w.x;
  const kwh = w.kwh as number;

  weekendText = `Fin de semana pico: día ${day} (${fmt0(kwh)} kWh).`;
}

const body2 =
  `El día más alto fue el ${max.x} (${fmt0(max.kwh as number)} kWh) y el más bajo el ${min.x} (${fmt0(min.kwh as number)} kWh).` +
  weekendText;

    const body3 = priorM
      ? `Este mes (${currentM.x}) está ${yoyPct >= 0 ? "por encima" : "por debajo"} de ${priorM.x} en ~${Math.abs(yoyPct).toFixed(1)}% (${yoyAbs >= 0 ? "+" : "-"}${fmt0(Math.abs(yoyAbs))} kWh).`
      : `No hay referencia del mismo mes del año anterior en el mockup para comparar.`;

    return [
      { title: "Semana vs fin de semana", body: body1 },
      { title: "Días destacados", body: body2 },
      { title: "Mes vs año anterior", body: body3 },
    ];
  }

  // SEMANA
  if (mode === "semana") {
    const byMonth: Record<string, number[]> = {};
    clean.forEach((d) => {
      const m = d.month || "";
      if (!m) return;
      if (!byMonth[m]) byMonth[m] = [];
      byMonth[m].push(d.kwh as number);
    });

    const months = Object.keys(byMonth);
    const avgByM = months
      .map((m) => ({ m, avg: byMonth[m].reduce((s, v) => s + v, 0) / byMonth[m].length }))
      .sort((a, b) => b.avg - a.avg);

    const hi = avgByM[0];
    const lo = avgByM[avgByM.length - 1];

    const order = ["Dic", "Ene", "Feb"];
    const present = order.filter((m) => byMonth[m]);
    const lastM = present[present.length - 1];
    const prevM = present.length >= 2 ? present[present.length - 2] : null;

    const lastAvg = lastM ? byMonth[lastM].reduce((s, v) => s + v, 0) / byMonth[lastM].length : 0;
    const prevAvg = prevM ? byMonth[prevM].reduce((s, v) => s + v, 0) / byMonth[prevM].length : lastAvg;
    const lastVsPrev = pct(lastAvg, prevAvg);

    return [
      {
        title: "Comparación por mes",
        body: `${monthFull(hi.m)} es el mes con mayor promedio semanal (~${fmt0(hi.avg)} kWh/sem) y ${monthFull(lo.m)} el menor (~${fmt0(lo.avg)} kWh/sem).`,
      },
      {
        title: "Semanas destacadas",
        body: `La semana pico fue ${max.x} (${fmt0(max.kwh as number)} kWh) y la más baja ${min.x} (${fmt0(min.kwh as number)} kWh).`,
      },
      {
        title: "Conclusión",
        body: prevM
          ? `${monthFull(lastM)} está ${lastVsPrev >= 0 ? "por encima" : "por debajo"} de ${monthFull(prevM)} en ~${Math.abs(lastVsPrev).toFixed(1)}%.`
          : "Se observa estabilidad semanal con variaciones suaves.",
      },
    ];
  }

  // MES
  const y25 = clean.filter((d) => d.year === 2025);
  const y26 = clean.filter((d) => d.year === 2026);
  const avg25 = y25.length ? y25.reduce((s, d) => s + (d.kwh as number), 0) / y25.length : 0;
const avg26 = y26.length ? y26.reduce((s, d) => s + (d.kwh as number), 0) / y26.length : 0;
  const yChange = pct(avg26, avg25);

  return [
    {
      title: "Pico y mínimo",
      body: `En 2025 tu pico fue ${max.x} (${fmt0(max.kwh as number)} kWh) y el mínimo ${min.x} (${fmt0(min.kwh as number)} kWh).`,
    },
    {
      title: "Cambio de año",
      body: y26.length
        ? `2026 arranca en ~${fmt0(avg26)} kWh/mes, ${yChange >= 0 ? "por encima" : "por debajo"} del promedio 2025 (~${fmt0(avg25)}).`
        : `Promedio 2025: ~${fmt0(avg25)} kWh/mes.`,
    },
    {
      title: "Conclusión",
      body: "Tendencia ilustrativa para diseño (se ajusta con datos reales).",
    },
  ];
}

function Heatmap({ data, cols }: { data: number[][]; cols: number }) {
  const c = cols || 7;
  const dayNames = ["Lu", "Ma", "Mi", "Ju", "Vi", "Sá", "Do"];

  const flat = (data || [])
    .flat()
    .map((v) => Number(v))
    .filter((v) => Number.isFinite(v));

  const minV = flat.length ? Math.min(...flat) : 0;
  const maxV = flat.length ? Math.max(...flat) : 1;
  const denom = Math.max(1e-6, maxV - minV);
  const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
  return (
    <div className="overflow-hidden rounded-3xl bg-white ring-1 ring-slate-200">
      <div className="grid" style={{ gridTemplateColumns: `repeat(${c}, minmax(0, 1fr))` }}>
        {(data || []).map((row, h) =>
          row.map((v, d) => {
            const raw = Number(v || 0);
            const norm = clamp01((raw - minV) / denom);
            const a = 0.10 + 0.78 * norm; // 0.10 → 0.88
            const hour = String(h).padStart(2, "0") + ":00";
            return (
              <div
                key={h + "-" + d}
                className="h-3 sm:h-4"
                style={{
                  backgroundColor: "rgba(249, 115, 22, " + a + ")",
                  boxShadow: "inset 0 0 0 0.6px rgba(226,232,240,0.85)",
                }}
                title={`${dayNames[d]} · ${hour} · Intensidad ${Math.round(norm * 100)}%`}
              />
            );
          })
        )}
      </div>
    </div>
  );
}

function deriveHeatmapInsights(hm: number[][]) {
  const dayNamesFull = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
  const dayNames = ["Lu", "Ma", "Mi", "Ju", "Vi", "Sá", "Do"];

  const rows = (hm || []).length;
  const cols = rows ? (hm[0] || []).length : 0;
  if (!rows || !cols) {
    return {
      opWindow: null,
      outsideShare: 0,
      peak: null,
      bullets: [
        { title: "Lectura", body: "No hay datos suficientes para generar una lectura." },
        { title: "", body: "" },
        { title: "", body: "" },
      ],
      eco: { title: "Eco-feedback", body: "" },
    };
  }

  const byHour = Array.from({ length: rows }, () => 0);
  const byDay = Array.from({ length: cols }, () => 0);
  let total = 0;

  let peak = { h: 0, d: 0, v: -1 };

  for (let h = 0; h < rows; h++) {
    for (let d = 0; d < cols; d++) {
      const v = Number(hm[h][d] || 0);
      total += v;
      byHour[h] += v;
      byDay[d] += v;
      if (v > peak.v) peak = { h, d, v };
    }
  }

  const avgHour = byHour.map((s) => s / cols);
  const avgDay = byDay.map((s) => s / rows);

  const maxHour = Math.max(...avgHour);
  const thr = maxHour * 0.58;
  const active = avgHour.map((v) => v >= thr);

  let bestStart = 0;
  let bestLen = 0;
  let curStart = 0;
  let curLen = 0;

  for (let h = 0; h < rows; h++) {
    if (active[h]) {
      if (curLen === 0) curStart = h;
      curLen += 1;
      if (curLen > bestLen) {
        bestLen = curLen;
        bestStart = curStart;
      }
    } else {
      curLen = 0;
    }
  }

  const opStart = bestLen >= 5 ? bestStart : 9;
  const opEnd = bestLen >= 5 ? bestStart + bestLen - 1 : 18;

  let outside = 0;
  for (let h = 0; h < rows; h++) {
    const isOutside = h < opStart || h > opEnd;
    if (!isOutside) continue;
    for (let d = 0; d < cols; d++) outside += Number(hm[h][d] || 0);
  }
  const outsideShare = total ? outside / total : 0;

  const peakHour = String(peak.h).padStart(2, "0") + ":00";
  const peakDay = dayNamesFull[peak.d];

  const opLabel = `${String(opStart).padStart(2, "0")}:00–${String(opEnd).padStart(2, "0")}:00`;

  const b1 = {
    title: "Horario más activo",
    body: `La mayor actividad se concentra entre ${opLabel}. Pico principal: ${peakDay} a las ${peakHour}.`,
  };

  const b2 = {
    title: "Fuera de horario",
    body:
      outsideShare >= 0.12
        ? `Aproximadamente ${Math.round(outsideShare * 100)}% ocurre fuera del horario más activo. Oportunidad: revisar equipos que quedan encendidos.`
        : `El consumo fuera del horario más activo es bajo (~${Math.round(outsideShare * 100)}%). Se ve buen control de cierre.`,
  };

  const b3 = {
    title: "Fin de semana",
    body:
      avgDay[6] < (avgDay[0] + avgDay[1] + avgDay[2] + avgDay[3] + avgDay[4]) / 5
        ? "El domingo tiende a bajar vs días hábiles (coincide con menor operación)."
        : "El domingo se mantiene cercano a días hábiles. Si el negocio cierra, revisa consumo base.",
  };

  const eco = {
    title: "Eco-feedback",
    body:
      outsideShare >= 0.12
        ? `Se detecta consumo relevante fuera del horario principal (~${Math.round(outsideShare * 100)}%). Una acción rápida es implementar rutina de cierre y validar equipos en stand-by.`
        : `Buen control: el consumo se concentra en horario de operación. Mantén la rutina de cierre y monitorea picos puntuales como ${dayNames[peak.d]} ${peakHour}.`,
  };

  return {
    opWindow: { opStart, opEnd, label: opLabel },
    outsideShare,
    peak: { ...peak, peakDay, peakHour },
    bullets: [b1, b2, b3],
    eco,
  };
}

function GadgetTendencia({
  selectedMonthKey,
  setMonth,
}: {
  selectedMonthKey: string;
  setMonth: (m: string) => void;
}){
  const [mode, setMode] = useState("dia");
  const data = useMemo<TrendData[]>(() => buildTrend(mode), [mode]);
  const insights = useMemo(() => deriveInsights(mode, data, selectedMonthKey), [mode, data, selectedMonthKey]);

  const subtitle =
    mode === "dia"
      ? "Día a día"
      : mode === "semana"
      ? "Semana a semana · últimas 12 semanas (3 meses)"
      : "Mes a mes · 2025 completo + lo que va de 2026";

  const yDomain = mode === "dia" ? [0, 220] : mode === "semana" ? [0, 1100] : [0, 12000];

  const xProps =
    mode === "mes"
      ? { interval: 0, angle: -25, textAnchor: "end", height: 50 }
      : mode === "semana"
      ? { interval: 0, angle: -10, textAnchor: "end", height: 38 }
      : { interval: 0, angle: 0, textAnchor: "middle", height: 30 };

  return (
    <Card
      title="Gadget 2 · Tendencia de consumo"
      subtitle={subtitle}
      icon={<LineChart className="h-5 w-5" />}
      right={
      
    <div className="flex items-center gap-3">

    {/* Selector de mes */}
    <SelectMonth value={selectedMonthKey} onChange={(value) => setMonth(value)} />

    {/* Botón descargar */}
    <button className="rounded-2xl bg-orange-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-700">
      <Download className="h-4 w-4 inline-block mr-2" />
      Descargar
    </button>

    {/* Separador visual */}
    <div className="h-6 w-px bg-slate-200 mx-1" />

    {/* Controles existentes */}
    <Pill tone="orange">
      <LineChart className="h-4 w-4" />
      Barras
    </Pill>

    <div className="flex rounded-2xl bg-slate-50 p-1 ring-1 ring-slate-200">
      {[{ k: "dia", label: "Día" }, { k: "semana", label: "Semana" }, { k: "mes", label: "Mes" }].map((t) => (
        <button
          key={t.k}
          onClick={() => setMode(t.k)}
          className={
            "rounded-xl px-3 py-1 text-xs font-semibold " +
            (mode === t.k
              ? "bg-white text-slate-900 ring-1 ring-slate-200"
              : "text-slate-600 hover:text-slate-900")
          }
        >
          {t.label}
        </button>
      ))}
    </div>

  </div>
      }
    >


      <div className="w-full">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <RBarChart data={data} margin={{ top: 8, right: 12, bottom: 8, left: 6 }}>
              <defs>
                <linearGradient id="gradDefault" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.55} />
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0.10} />
                </linearGradient>
                <linearGradient id="gradDic" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.65} />
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0.12} />
                </linearGradient>
                <linearGradient id="gradEne" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.40} />
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0.08} />
                </linearGradient>
                <linearGradient id="gradFeb" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.52} />
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0.10} />
                </linearGradient>
                <linearGradient id="gradY25" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.38} />
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0.08} />
                </linearGradient>
                <linearGradient id="gradY26" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.62} />
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0.12} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" />

              <XAxis
                dataKey="x"
                tick={{ fontSize: 12 }}
                interval={xProps.interval}
                angle={xProps.angle}
                textAnchor={xProps.textAnchor}
                height={xProps.height}
                tickFormatter={(v) => (String(v).startsWith("__gap") ? "" : v)}
              />
              <YAxis tick={{ fontSize: 12 }} domain={yDomain} />

              {mode === "semana" ? (
                <>
                  <ReferenceLine x="Ene S1" stroke="#f97316" strokeOpacity={0.22} strokeDasharray="4 6" />
                  <ReferenceLine x="Feb S1" stroke="#f97316" strokeOpacity={0.22} strokeDasharray="4 6" />
                </>
              ) : null}
              {mode === "mes" ? <ReferenceLine x="__gap_year_25_26" stroke="#f97316" strokeOpacity={0.22} strokeDasharray="4 6" /> : null}

              <Tooltip
                content={({ active, payload, label }) => {
                  if (!active || !payload || payload.length === 0) return null;
                  if (String(label).startsWith("__gap")) return null;
                  return <TooltipBox label={"Periodo " + String(label)} value={(payload?.[0] as any)?.value} unit="kWh" />;
                }}
              />

              <Bar dataKey="kwh" radius={[12, 12, 0, 0]}>
                {data.map((entry, index) => {
                  if (entry?.isGap) return <Cell key={"cell-" + index} fill="rgba(0,0,0,0)" />;

                  const m = entry?.month;
                  const fillId =
                    mode === "semana"
                      ? m === "Dic"
                        ? "url(#gradDic)"
                        : m === "Ene"
                        ? "url(#gradEne)"
                        : m === "Feb"
                        ? "url(#gradFeb)"
                        : "url(#gradDefault)"
                      : mode === "mes"
                      ? entry?.year === 2026
                        ? "url(#gradY26)"
                        : entry?.year === 2025
                        ? "url(#gradY25)"
                        : "url(#gradDefault)"
                      : "url(#gradDefault)";

                  return <Cell key={"cell-" + index} fill={fillId} />;
                })}
              </Bar>
            </RBarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
        <MiniNote icon={<Sun className="h-4 w-4 text-orange-600" />} title={insights[0]?.title} body={insights[0]?.body} />
        <MiniNote icon={<Moon className="h-4 w-4 text-orange-600" />} title={insights[1]?.title} body={insights[1]?.body} />
        <MiniNote icon={<Zap className="h-4 w-4 text-orange-600" />} title={insights[2]?.title} body={insights[2]?.body} />
      </div>
    </Card>
  );
}

function GadgetHeatmap() {
  const hm = useMemo(() => buildHeatmap(), []);
  const insights = useMemo(() => deriveHeatmapInsights(hm), [hm]);

  return (
    <Card
      title="Gadget 3 · Mapa hora vs día"
      subtitle=""
      icon={<Gauge className="h-5 w-5" />}
      right={
        <Pill>
          <Gauge className="h-4 w-4 text-orange-600" />Patrones
        </Pill>
      }
    >
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_360px]">
        <div className="rounded-3xl bg-slate-50 p-4 ring-1 ring-slate-200">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Lu</span>
            <span>Ma</span>
            <span>Mi</span>
            <span>Ju</span>
            <span>Vi</span>
            <span>Sá</span>
            <span>Do</span>
          </div>

          <div className="mt-2">
            <Heatmap data={hm} cols={7} />
          </div>

          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
            <span>00:00</span>
            <span>06:00</span>
            <span>12:00</span>
            <span>18:00</span>
            <span>23:00</span>
          </div>

          <div className="mt-3 flex items-center justify-between gap-3 rounded-2xl bg-white px-3 py-2 ring-1 ring-slate-200">
            <div className="text-xs text-slate-600">Intensidad</div>
            <div className="flex-1">
              <div className="h-2 rounded-full bg-gradient-to-r from-orange-100 via-orange-300 to-orange-500" />
            </div>
            <div className="text-xs text-slate-500">Baja → Alta</div>
          </div>
        </div>

        <div className="rounded-3xl bg-slate-50 p-4 ring-1 ring-slate-200">
          <div className="flex items-center justify-between">
            <div className="text-xs font-semibold text-slate-900">Lectura automática</div>
            {insights?.opWindow?.label ? (
              <Pill tone="orange">
                <Sun className="h-4 w-4" />
                {insights.opWindow.label}
              </Pill>
            ) : null}
          </div>

          <div className="mt-3 space-y-2">
            <MiniNote icon={<Sun className="h-4 w-4 text-orange-600" />} title={insights.bullets[0]?.title} body={insights.bullets[0]?.body} />
            <MiniNote icon={<Moon className="h-4 w-4 text-orange-600" />} title={insights.bullets[1]?.title} body={insights.bullets[1]?.body} />
            <MiniNote icon={<Zap className="h-4 w-4 text-orange-600" />} title={insights.bullets[2]?.title} body={insights.bullets[2]?.body} />
          </div>

          <div className="mt-3 rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200 border-t-4 border-orange-200">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-orange-100 text-orange-700 ring-1 ring-orange-200/70">
                <Sparkles className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-semibold text-slate-900">{insights.eco.title}</div>
                <div className="mt-1.5 text-sm leading-relaxed text-slate-700">{insights.eco.body}</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Pill>
                    <Moon className="h-4 w-4 text-orange-600" />Fuera de horario ~{Math.round((insights.outsideShare || 0) * 100)}%
                  </Pill>
                  <Pill>
                    <Bell className="h-4 w-4 text-orange-600" />Pico: {insights.peak?.peakDay || ""} {insights.peak?.peakHour || ""}
                  </Pill>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}



export default function MockupEcoFeedback522() {
  const [month, setMonth] = useState("2026-02");

  return (
    <div className="min-h-screen bg-gradient-to-b to-white p-6">
      <div className="w-full">
        

        <div className="space-y-4">
          <GadgetTendencia selectedMonthKey={month} setMonth={setMonth} />
          <GadgetHeatmap />
        </div>

        <div className="mt-4 text-xs text-slate-500">Nota: valores simulados para diseño.</div>

        <div className="mt-3 rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
          <div className="flex items-start gap-2">
            <div className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-50 text-slate-700 ring-1 ring-slate-200">
              <CircleHelp className="h-4 w-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-900">Nota (mockup)</div>
              <div className="mt-1 text-xs text-slate-600">Los textos son lecturas automáticas ilustrativas basadas en los datos del mockup.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
