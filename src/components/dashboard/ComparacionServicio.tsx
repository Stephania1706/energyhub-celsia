"use client";
import React, { useMemo, useState } from "react";
import {
    AlertTriangle,
    ArrowDownRight,
    ArrowUpRight,
    BarChart3,
    Building2,
    CheckCircle2,
    Gauge,
    Info,
    MapPin,
    Search,
    SlidersHorizontal,
    Sparkles,
    Target,
    Users,
    Zap,
    } from "lucide-react";

    // ------------------------------------------------------------
    // UI helpers (sobrio, consistente con Tarifa/Eco-feedback)
    // ------------------------------------------------------------

    function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
    return <div className={`rounded-3xl bg-white shadow-sm ring-1 ring-slate-200 ${className}`}>{children}</div>;
    }

    function Chip({
    children,
    tone = "slate",
    }: {
    children: React.ReactNode;
    tone?: "slate" | "orange" | "red" | "green" | "blue";
    }) {
    const tones: Record<string, string> = {
        slate: "bg-slate-50 text-slate-700 ring-slate-200",
        orange: "bg-orange-50 text-orange-700 ring-orange-200",
        red: "bg-red-50 text-red-700 ring-red-200",
        green: "bg-emerald-50 text-emerald-700 ring-emerald-200",
        blue: "bg-sky-50 text-sky-700 ring-sky-200",
    };
    return (
        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${tones[tone]}`}>{children}</span>
    );
    }

    function Badge({ label, tone }: { label: string; tone: "ok" | "warn" | "bad" | "na" }) {
    const map = {
        ok: "bg-emerald-50 text-emerald-700 ring-emerald-200",
        warn: "bg-orange-50 text-orange-700 ring-orange-200",
        bad: "bg-red-50 text-red-700 ring-red-200",
        na: "bg-slate-50 text-slate-700 ring-slate-200",
    } as const;
    return <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${map[tone]}`}>{label}</span>;
    }

    function TitleBlock({
    kicker,
    title,
    subtitle,
    size = "page",
    }: {
    kicker: string;
    title: string;
    subtitle?: string;
    size?: "page" | "section";
    }) {
    const titleClass =
        size === "page" ? "text-2xl font-bold tracking-tight text-slate-900" : "text-xl font-bold tracking-tight text-slate-900";
    return (
        <div>
        <div className="text-xs font-semibold text-slate-500">{kicker}</div>
        <div className={`mt-1 ${titleClass}`}>{title}</div>
        {subtitle ? <div className="mt-1 text-[13px] leading-relaxed text-slate-600">{subtitle}</div> : null}
        </div>
    );
    }

    function SoftSelect({
    label,
    value,
    onChange,
    children,
    }: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    children: React.ReactNode;
    }) {
    return (
        <div className="rounded-3xl bg-white p-3 ring-1 ring-slate-200">
        <div className="text-xs font-semibold text-slate-500">{label}</div>
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="mt-1 w-full bg-transparent text-sm font-semibold text-slate-900 outline-none"
        >
            {children}
        </select>
        </div>
    );
    }

    function Metric({
    icon,
    label,
    value,
    hint,
    accent = "slate",
    }: {
    icon: React.ReactNode;
    label: string;
    value: string;
    hint: string;
    accent?: "slate" | "orange" | "green" | "red";
    }) {
    const accentMap: Record<string, string> = {
        slate: "bg-slate-50 text-slate-700 ring-slate-200",
        orange: "bg-orange-50 text-orange-700 ring-orange-200",
        green: "bg-emerald-50 text-emerald-700 ring-emerald-200",
        red: "bg-red-50 text-red-700 ring-red-200",
    };
    return (
        <div className="rounded-3xl bg-white p-5 ring-1 ring-slate-200">
        <div className="flex items-start gap-3">
            <div className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ring-1 ${accentMap[accent]}`}>{icon}</div>
            <div className="min-w-0">
            <div className="text-sm font-semibold text-slate-700">{label}</div>
            <div className="mt-1 text-xl font-bold tracking-tight text-slate-900">{value}</div>
            <div className="mt-1 text-[13px] leading-relaxed text-slate-600">{hint}</div>
            </div>
        </div>
        </div>
    );
    }

    function fmt(n: number, digits = 0) {
    const d = Math.pow(10, digits);
    const v = Math.round(n * d) / d;
    return v.toLocaleString("es-CO", { maximumFractionDigits: digits, minimumFractionDigits: digits });
    }

    function fmtNorm(n: number) {
    if (!Number.isFinite(n)) return "N/D";
    const a = Math.abs(n);
    if (a >= 1000) return fmt(n, 0);
    if (a >= 100) return fmt(n, 1);
    if (a >= 10) return fmt(n, 2);
    return fmt(n, 3);
    }

    type SiteType = "Bodega" | "Galpón" | "Pozo riego" | "Planta";

    type RefMetric = "Área (m²)" | "Empleados" | "Potencia instalada (kW)" | "Producción (u)";

    type Site = {
    id: string;
    name: string;
    type: SiteType;
    city: string;
    kwh: number; // periodo
    area_m2: number;
    employees: number;
    kw_installed: number;
    production_u: number;
    };

    type Row = Site & {
    ref: number;
    refOk: boolean;
    intensity: number; // kWh por referencia
    delta: number; // vs promedio de consumo específico
    status: "ok" | "warn" | "bad" | "na";
    };

    function minmax(values: number[]) {
    const min = Math.min(...values);
    const max = Math.max(...values);
    return { min, max: max === min ? min + 1 : max };
    }

    function getRefUnit(refMetric: RefMetric) {
    switch (refMetric) {
        case "Área (m²)":
        return "m²";
        case "Empleados":
        return "empleados";
        case "Potencia instalada (kW)":
        return "kW";
        case "Producción (u)":
        return "unid.";
        default:
        return "";
    }
    }

    function getIntensityUnit(refMetric: RefMetric) {
    switch (refMetric) {
        case "Área (m²)":
        return "kWh/m²";
        case "Empleados":
        return "kWh/empleado";
        case "Potencia instalada (kW)":
        return "kWh/kW";
        case "Producción (u)":
        return "kWh/unid.";
        default:
        return "kWh";
    }
    }

    export default function Mockup524ComparacionMultisede() {
    const [period, setPeriod] = useState("Febrero 2026");
    const [group, setGroup] = useState<SiteType | "Todas">("Todas");
    const [refMetric, setRefMetric] = useState<RefMetric>("Área (m²)");
    const [query, setQuery] = useState("");
    const [selected, setSelected] = useState<string>("S3");
    const [compareA, setCompareA] = useState<string>("S3");
    const [compareB, setCompareB] = useState<string>("S6");

    const sites: Site[] = useMemo(
        () => [
        { id: "S1", name: "Bodega Yumbo 01", type: "Bodega", city: "Yumbo", kwh: 9820, area_m2: 4200, employees: 58, kw_installed: 180, production_u: 0 },
        { id: "S2", name: "Bodega Palmira 02", type: "Bodega", city: "Palmira", kwh: 8350, area_m2: 3900, employees: 44, kw_installed: 155, production_u: 0 },
        { id: "S3", name: "Planta Acopi 01", type: "Planta", city: "Cali", kwh: 22150, area_m2: 5200, employees: 92, kw_installed: 310, production_u: 1250 },
        { id: "S4", name: "Galpón Avícola 03", type: "Galpón", city: "Candelaria", kwh: 14600, area_m2: 2800, employees: 18, kw_installed: 210, production_u: 780 },
        // Pozo: no tiene sentido normalizar por m²/producción (puede usarse por kW instalado o por horas, en una versión futura)
        { id: "S5", name: "Pozo Riego 02", type: "Pozo riego", city: "Ginebra", kwh: 11950, area_m2: 0, employees: 6, kw_installed: 120, production_u: 0 },
        { id: "S6", name: "Planta Agro 02", type: "Planta", city: "Palmira", kwh: 18780, area_m2: 5100, employees: 66, kw_installed: 260, production_u: 980 },
        { id: "S7", name: "Galpón Avícola 04", type: "Galpón", city: "Cerrito", kwh: 13210, area_m2: 2650, employees: 16, kw_installed: 195, production_u: 720 },
        { id: "S8", name: "Bodega Cali 03", type: "Bodega", city: "Cali", kwh: 9050, area_m2: 4100, employees: 49, kw_installed: 165, production_u: 0 },
        ],
        []
    );

    const filtered: Site[] = useMemo(() => {
        const q = query.trim().toLowerCase();
        return sites
        .filter((s) => (group === "Todas" ? true : s.type === group))
        .filter((s) => (q ? `${s.name} ${s.city} ${s.type}`.toLowerCase().includes(q) : true));
    }, [sites, group, query]);

    const intensityUnit = useMemo(() => getIntensityUnit(refMetric), [refMetric]);
    const refUnit = useMemo(() => getRefUnit(refMetric), [refMetric]);

    const refValue = (s: Site) => {
        switch (refMetric) {
        case "Área (m²)":
            return s.area_m2;
        case "Empleados":
            return s.employees;
        case "Potencia instalada (kW)":
            return s.kw_installed;
        case "Producción (u)":
            return s.production_u;
        default:
            return 0;
        }
    };

    const dataset = useMemo(() => {
        const rows0: Row[] = filtered.map((s) => {
        const ref = refValue(s);
        const refOk = ref > 0;
        const intensity = refOk ? s.kwh / ref : Number.NaN;
        return {
            ...s,
            ref,
            refOk,
            intensity,
            delta: 0,
            status: refOk ? "warn" : "na",
        };
        });

        const comparable = rows0.filter((r) => r.refOk && Number.isFinite(r.intensity));
        const avg = comparable.reduce((acc, r) => acc + r.intensity, 0) / Math.max(comparable.length, 1);

        const rows: Row[] = rows0
        .map((r) => {
            
            if (!r.refOk || !Number.isFinite(r.intensity) || !Number.isFinite(avg) || avg === 0) {
            return {
    ...r,
    delta: 0,
    status: (r.refOk ? "warn" : "na") as Row["status"],
    };
            }
            const delta = (r.intensity - avg) / avg;
            const abs = Math.abs(delta);
            const status: Row["status"] = abs <= 0.1 ? "ok" : abs <= 0.22 ? "warn" : "bad";
            return { ...r, delta, status };
        })
        // orden: comparables primero, luego no comparables
        .sort((a, b) => {
            if (a.refOk && !b.refOk) return -1;
            if (!a.refOk && b.refOk) return 1;
            if (!a.refOk && !b.refOk) return a.name.localeCompare(b.name);
            return (b.intensity || 0) - (a.intensity || 0);
        });

        const best = [...rows].filter((r) => r.refOk).sort((a, b) => a.intensity - b.intensity)[0];
        const worst = [...rows].filter((r) => r.refOk).sort((a, b) => b.intensity - a.intensity)[0];

        return { rows, avg, best, worst, comparableCount: comparable.length };
    }, [filtered, refMetric]);

    const selectedSite = dataset.rows.find((r) => r.id === selected) || dataset.rows[0];
    const aSite = dataset.rows.find((r) => r.id === compareA) || dataset.rows[0];
    const bSite = dataset.rows.find((r) => r.id === compareB) || dataset.rows.find((r) => r.id !== compareA) || dataset.rows[0];

    const insights = useMemo(() => {
        const comparable = dataset.rows.filter((r) => r.refOk);
        const top = comparable.slice(0, 3);
        const low = [...comparable].slice(-2).reverse();

        const pick = (r: Row) => {
        const pct = r.delta * 100;
        const dir = pct >= 0 ? "arriba" : "abajo";
        const icon = pct >= 0 ? "↑" : "↓";
        return `${r.name}: ${icon} ${fmt(Math.abs(pct), 1)}% ${dir} del promedio (${fmtNorm(r.intensity)} ${intensityUnit})`;
        };

        const executive =
        comparable.length > 0
            ? `Se observan diferencias en consumo específico (${intensityUnit}). La sede con mayor desviación es ${top[0]?.name || "—"} (≈ ${fmt(Math.abs((top[0]?.delta || 0) * 100), 1)}% vs promedio).`
            : `Con la referencia “${refMetric}” algunas sedes no tienen dato comparable. Cambia la referencia (p. ej. “Potencia instalada (kW)”) para incluir más sedes.`;

        return {
        executive,
        top: top.map(pick),
        low: low.map(pick),
        };
    }, [dataset.rows, intensityUnit, refMetric]);

    const normRange = useMemo(() => {
        const vals = dataset.rows.filter((r) => r.refOk).map((r) => r.intensity);
        return minmax(vals.length ? vals : [0, 1]);
    }, [dataset.rows]);

    const scatter = useMemo(() => {
        const comp = dataset.rows.filter((r) => r.refOk);
        const rx = minmax(comp.map((r) => r.ref));
        const ry = minmax(comp.map((r) => r.kwh));
        const pad = 12;

        const toX = (v: number) => pad + ((v - rx.min) / (rx.max - rx.min)) * (100 - pad * 2);
        const toY = (v: number) => 100 - pad - ((v - ry.min) / (ry.max - ry.min)) * (100 - pad * 2);

        return {
        rx,
        ry,
        toX,
        toY,
        avgX: toX(comp.reduce((a, r) => a + r.ref, 0) / Math.max(comp.length, 1)),
        avgY: toY(comp.reduce((a, r) => a + r.kwh, 0) / Math.max(comp.length, 1)),
        };
    }, [dataset.rows]);

    const statusChipTone = (s: Row) => (s.status === "bad" ? "red" : s.status === "warn" ? "orange" : s.status === "ok" ? "green" : "slate");
    const statusLabel = (s: Row) => (s.status === "bad" ? "Atención" : s.status === "warn" ? "Revisar" : s.status === "ok" ? "En línea" : "Sin ref.");

    return (
        <div className="min-h-screen bg-slate-100 text-slate-900">
        <div className="w-full space-y-5">
            {/* Header */}
            <Card className="overflow-hidden border-t-4 border-orange-200">
            <div className="bg-gradient-to-r from-orange-50 via-white to-white p-6">
                <div className="flex flex-wrap items-start justify-between gap-5">
                <div className="flex items-start gap-3">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-700 ring-1 ring-orange-200/80">
                    <BarChart3 className="h-6 w-6" />
                    </div>
                    <TitleBlock
                    kicker="Funcionalidad 5.2.4"
                    title="Comparación de desempeño energético entre sedes"
                    subtitle="Compara instalaciones similares para identificar desviaciones y priorizar acciones operativas (sin tecnicismos)."
                    size="page"
                    />
                </div>

                <div className="grid w-full grid-cols-1 gap-3 sm:w-auto sm:grid-cols-2 lg:grid-cols-4">
                    <SoftSelect label="Periodo" value={period} onChange={setPeriod}>
                    <option>Febrero 2026</option>
                    <option>Enero 2026</option>
                    <option>Diciembre 2025</option>
                    </SoftSelect>

                    <SoftSelect label="Grupo comparable" value={group} onChange={(v) => setGroup(v as any)}>
                    <option value="Todas">Todas</option>
                    <option value="Planta">Plantas</option>
                    <option value="Bodega">Bodegas</option>
                    <option value="Galpón">Galpones</option>
                    <option value="Pozo riego">Pozos de riego</option>
                    </SoftSelect>

                    <SoftSelect label="Referencia" value={refMetric} onChange={(v) => setRefMetric(v as any)}>
                    <option>Área (m²)</option>
                    <option>Empleados</option>
                    <option>Potencia instalada (kW)</option>
                    <option>Producción (u)</option>
                    </SoftSelect>

                    <div className="rounded-3xl bg-white p-3 ring-1 ring-slate-200">
                    <div className="text-xs font-semibold text-slate-500">Buscar sede</div>
                    <div className="mt-1 flex items-center gap-2">
                        <Search className="h-4 w-4 text-slate-400" />
                        <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Ej.: Palmira, planta, pozo…"
                        className="w-full bg-transparent text-sm font-semibold text-slate-900 outline-none placeholder:text-slate-400"
                        />
                    </div>
                    </div>
                </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                <Chip tone="orange">
                    <Sparkles className="h-3.5 w-3.5" />
                    Lectura simple
                </Chip>
                <Chip tone="slate">
                    <Target className="h-3.5 w-3.5 text-orange-600" />
                    Priorizar acciones
                </Chip>
                <Chip tone="slate">
                    <SlidersHorizontal className="h-3.5 w-3.5 text-orange-600" />
                    Consumo específico: {intensityUnit}
                </Chip>
                </div>
            </div>
            </Card>

            {/* KPIs (más claros) */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            <Metric
                icon={<Users className="h-5 w-5" />}
                label="Sedes comparadas"
                value={`${dataset.rows.length}`}
                hint={dataset.comparableCount ? `${dataset.comparableCount} con referencia válida (${refMetric})` : `Grupo: ${group}`}
                accent="slate"
            />
            <Metric
                icon={<ArrowDownRight className="h-5 w-5" />}
                label="Mejor consumo específico"
                value={dataset.best ? `${fmtNorm(dataset.best.intensity)}` : "—"}
                hint={dataset.best ? `${dataset.best.name} · ${intensityUnit}` : "Sin comparación"}
                accent="green"
            />
            <Metric
                icon={<ArrowUpRight className="h-5 w-5" />}
                label="Mayor consumo específico"
                value={dataset.worst ? `${fmtNorm(dataset.worst.intensity)}` : "—"}
                hint={dataset.worst ? `${dataset.worst.name} · ${intensityUnit}` : "Sin comparación"}
                accent="orange"
            />
            <Metric
                icon={<Gauge className="h-5 w-5" />}
                label="Consumo específico promedio"
                value={Number.isFinite(dataset.avg) ? fmtNorm(dataset.avg) : "—"}
                hint={`Normalizado por ${refMetric} · ${intensityUnit}`}
                accent="slate"
            />
            </div>

            {/* Gadgets */}
            <div className="space-y-7 ">
            {/* Gadget 1 */}
            <Card className="p-6 border-t-4 border-orange-200">
                <div className="flex flex-wrap items-start justify-between gap-3 ">
                <TitleBlock
                    kicker="Gadget 1"
                    title="Ranking por consumo específico (consumo relativo)"
                    subtitle={`Consumo específico = consumo del periodo dividido por la referencia (${refMetric}).`}
                    size="section"
                />
                <Chip tone="slate">
                    <Zap className="h-3.5 w-3.5 text-orange-600" />
                    {period}
                </Chip>
                </div>

                <div className="mt-5 grid grid-cols-1 gap-6 lg:grid-cols-[1.15fr_0.85fr]">
                <div className="rounded-3xl bg-slate-50/60 p-5 ring-1 ring-slate-200">
                    <div className="flex items-baseline justify-between gap-3">
                    <div className="text-sm font-semibold text-slate-900">Consumo específico por sede</div>
                    <div className="text-xs font-semibold text-slate-500">{intensityUnit}</div>
                    </div>

                    <div className="mt-4 max-h-[360px] space-y-2 overflow-auto pr-1">
                    {dataset.rows.map((r) => {
                        const w = r.refOk ? ((r.intensity - normRange.min) / (normRange.max - normRange.min)) * 100 : 0;
                        return (
                        <button
                            key={r.id}
                            onClick={() => setSelected(r.id)}
                            className={`flex w-full items-center gap-3 rounded-2xl bg-white p-4 ring-1 ring-slate-200 hover:bg-slate-50 ${selected === r.id ? "ring-orange-200 bg-orange-50/30" : ""}`}
                        >
                            <div className="w-12 text-xs font-semibold text-slate-600">{r.id}</div>
                            <div className="min-w-0 flex-1">
                            <div className="truncate text-sm font-semibold text-slate-900">{r.name}</div>
                            <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-slate-100 ring-1 ring-slate-200">
                                <div
                                className="h-full rounded-full bg-gradient-to-r from-orange-300 to-orange-500"
                                style={{ width: `${Math.max(6, Math.min(100, w))}%`, opacity: r.refOk ? 0.65 : 0.15 }}
                                />
                            </div>
                            {!r.refOk ? <div className="mt-2 text-[11px] font-semibold text-slate-500">Sin {refMetric} para comparar.</div> : null}
                            </div>
                            <div className="w-32 text-right text-xs font-bold text-slate-800">
                            {r.refOk ? `${fmtNorm(r.intensity)} ${intensityUnit}` : "N/D"}
                            </div>
                        </button>
                        );
                    })}
                    </div>

                    <div className="mt-4 text-[13px] text-slate-700">
                    Promedio del grupo (consumo específico): <span className="font-semibold text-slate-900">{Number.isFinite(dataset.avg) ? fmtNorm(dataset.avg) : "—"} {intensityUnit}</span>.
                    </div>
                </div>

                <div className="rounded-3xl bg-white p-5 ring-1 ring-slate-200">
                    <div className="flex items-start justify-between gap-2">
                    <div>
                        <div className="text-xs font-semibold text-slate-500">Sede seleccionada</div>
                        <div className="mt-1 text-xl font-bold tracking-tight text-slate-900">{selectedSite?.name || "—"}</div>
                        <div className="mt-1 text-sm text-slate-600">
                        {selectedSite?.type} · {selectedSite?.city}
                        </div>
                    </div>
                    <Chip tone={statusChipTone(selectedSite)}>
                        {selectedSite?.status === "bad" ? <AlertTriangle className="h-3.5 w-3.5" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
                        {statusLabel(selectedSite)}
                    </Chip>
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-3">
                    <div className="rounded-3xl bg-slate-50 p-4 ring-1 ring-slate-200">
                        <div className="text-xs font-semibold text-slate-500">Consumo</div>
                        <div className="mt-1 text-base font-bold text-slate-900">{fmt(selectedSite?.kwh || 0)} kWh</div>
                    </div>
                    <div className="rounded-3xl bg-slate-50 p-4 ring-1 ring-slate-200">
                        <div className="text-xs font-semibold text-slate-500">Consumo específico</div>
                        <div className="mt-1 text-base font-bold text-slate-900">{selectedSite?.refOk ? `${fmtNorm(selectedSite?.intensity || 0)} ${intensityUnit}` : "N/D"}</div>
                    </div>
                    <div className="rounded-3xl bg-slate-50 p-4 ring-1 ring-slate-200">
                        <div className="text-xs font-semibold text-slate-500">Vs promedio</div>
                        <div className="mt-1 text-base font-bold text-slate-900">{selectedSite?.refOk ? `${fmt(selectedSite.delta * 100, 1)}%` : "—"}</div>
                    </div>
                    <div className="rounded-3xl bg-slate-50 p-4 ring-1 ring-slate-200">
                        <div className="text-xs font-semibold text-slate-500">Referencia</div>
                        <div className="mt-1 text-base font-bold text-slate-900">{selectedSite?.refOk ? `${fmt(selectedSite.ref)} ${refUnit}` : "N/D"}</div>
                    </div>
                    </div>

                    <div className="mt-5 rounded-3xl bg-orange-50/70 p-4 ring-1 ring-orange-200/80">
                    <div className="flex items-start gap-2">
                        <Info className="mt-0.5 h-4 w-4 shrink-0 text-orange-700" />
                        <div className="text-[13px] leading-relaxed text-slate-800">
                        <span className="font-semibold">Lectura simple:</span> “consumo específico alta” es una señal para validar hábitos operativos (horarios, turnos, equipos). Si la sede no tiene referencia, cambia la referencia (p. ej. kW instalado) para compararla.
                        </div>
                    </div>
                    </div>
                </div>
                </div>
            </Card>

            {/* Gadget 2 */}
            <Card className="p-6 border-t-4 border-orange-200">
                <div className="flex flex-wrap items-start justify-between gap-3">
                <TitleBlock
                    kicker="Gadget 2"
                    title="Mapa comparativo (consumo vs referencia)"
                    subtitle="Cada punto es una sede. Útil para ver quién se sale del patrón del grupo."
                    size="section"
                />
                <Chip tone="slate">
                    <MapPin className="h-3.5 w-3.5 text-orange-600" />
                    Multi-sede
                </Chip>
                </div>

                <div className="mt-5 rounded-3xl bg-slate-50/60 p-5 ring-1 ring-slate-200">
                <div className="text-sm font-semibold text-slate-900">Eje X: {refMetric} ({refUnit}) · Eje Y: kWh del periodo</div>
                <div className="mt-4 h-[320px] w-full overflow-hidden rounded-3xl bg-white ring-1 ring-slate-200">
                    <svg viewBox="0 0 100 100" className="h-full w-full">
                    <line x1={scatter.avgX} y1={10} x2={scatter.avgX} y2={90} stroke="#CBD5E1" strokeDasharray="3 3" />
                    <line x1={10} y1={scatter.avgY} x2={90} y2={scatter.avgY} stroke="#CBD5E1" strokeDasharray="3 3" />

                    {dataset.rows
                        .filter((r) => r.refOk)
                        .map((r) => {
                        const x = scatter.toX(r.ref);
                        const y = scatter.toY(r.kwh);
                        const isSel = r.id === selected;
                        return (
                            <g key={r.id} onClick={() => setSelected(r.id)} style={{ cursor: "pointer" }}>
                            <circle cx={x} cy={y} r={isSel ? 2.8 : 2.1} fill={isSel ? "rgba(249,115,22,0.9)" : "rgba(249,115,22,0.45)"} />
                            {isSel ? <circle cx={x} cy={y} r={4.5} fill="none" stroke="rgba(249,115,22,0.35)" strokeWidth={1.5} /> : null}
                            </g>
                        );
                        })}

                    <line x1={10} y1={90} x2={90} y2={90} stroke="#CBD5E1" />
                    <line x1={10} y1={10} x2={10} y2={90} stroke="#CBD5E1" />
                    </svg>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="rounded-3xl bg-white p-4 ring-1 ring-slate-200">
                    <div className="text-xs font-semibold text-slate-500">Rango de referencia</div>
                    <div className="mt-1 text-[13px] text-slate-700">
                        {fmt(scatter.rx.min)} – {fmt(scatter.rx.max)} {refUnit}
                    </div>
                    </div>
                    <div className="rounded-3xl bg-white p-4 ring-1 ring-slate-200">
                    <div className="text-xs font-semibold text-slate-500">Rango de consumo</div>
                    <div className="mt-1 text-[13px] text-slate-700">
                        {fmt(scatter.ry.min)} – {fmt(scatter.ry.max)} kWh
                    </div>
                    </div>
                </div>

                <div className="mt-4 text-[13px] text-slate-700">Tip: selecciona un punto para ver su detalle en el Gadget 1.</div>
                </div>
            </Card>

            {/* Gadget 3 */}
            <Card className="p-6 border-t-4 border-orange-200">
                <div className="flex flex-wrap items-start justify-between gap-3">
                <TitleBlock
                    kicker="Gadget 3"
                    title="Tabla comparativa y priorización"
                    subtitle="Vista rápida para decidir dónde revisar primero."
                    size="section"
                />
                <Chip tone="slate">
                    <Building2 className="h-3.5 w-3.5 text-orange-600" />
                    Operación
                </Chip>
                </div>

                <div className="mt-5 overflow-hidden rounded-3xl ring-1 ring-slate-200">
                <div className="grid grid-cols-12 bg-orange-100 px-5 py-3 text-xs font-semibold text-slate-600">
                    <div className="col-span-4">Sede</div>
                    <div className="col-span-2 text-right">kWh</div>
                    <div className="col-span-2 text-right">Consumo específico</div>
                    <div className="col-span-2 text-right">Vs prom.</div>
                    <div className="col-span-2 text-right">Estado</div>
                </div>
                <div className="divide-y divide-slate-400 bg-white">
                    {dataset.rows.map((r) => (
                    <button
                        key={r.id}
                        onClick={() => setSelected(r.id)}
                        className={`grid w-full grid-cols-12 items-center px-5 py-4 text-left hover:bg-slate-50 ${selected === r.id ? "bg-orange-50/40" : ""}`}
                    >
                        <div className="col-span-4">
                        <div className="text-sm font-semibold text-slate-900">{r.name}</div>
                        <div className="mt-1 text-xs text-slate-500">{r.type} · {r.city}</div>
                        </div>
                        <div className="col-span-2 text-right text-sm font-semibold text-slate-900">{fmt(r.kwh)}</div>
                        <div className="col-span-2 text-right text-sm font-semibold text-slate-900">{r.refOk ? fmtNorm(r.intensity) : "N/D"}</div>
                        <div className="col-span-2 text-right text-sm font-semibold text-slate-900">{r.refOk ? `${fmt(r.delta * 100, 1)}%` : "—"}</div>
                        <div className="col-span-2 flex justify-end">
                        {r.status === "ok" ? (
                            <Badge label="En línea" tone="ok" />
                        ) : r.status === "warn" ? (
                            <Badge label="Revisar" tone="warn" />
                        ) : r.status === "bad" ? (
                            <Badge label="Prioridad" tone="bad" />
                        ) : (
                            <Badge label="Sin ref." tone="na" />
                        )}
                        </div>
                    </button>
                    ))}
                </div>
                </div>

                <div className="mt-6 rounded-3xl bg-slate-100 p-5 ring-1 ring-slate-200">
                <div className="text-sm font-semibold text-slate-900">Lectura ejecutiva</div>
                <div className="mt-2 text-[13px] leading-relaxed text-slate-700">{insights.executive}</div>

                <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="rounded-3xl bg-white p-5 ring-1 ring-slate-200">
                    <div className="text-xs font-semibold text-slate-500">Top 3 (más altos)</div>
                    <ul className="mt-3 space-y-2 text-[13px] text-slate-700">
                        {insights.top.length ? (
                        insights.top.map((t) => (
                            <li key={t} className="flex items-start gap-2">
                            <ArrowUpRight className="mt-0.5 h-4 w-4 text-orange-600" />
                            <span>{t}</span>
                            </li>
                        ))
                        ) : (
                        <li className="text-slate-500">No hay sedes comparables con la referencia actual.</li>
                        )}
                    </ul>
                    </div>
                    <div className="rounded-3xl bg-white p-5 ring-1 ring-slate-200">
                    <div className="text-xs font-semibold text-slate-500">Mejor desempeño (más bajos)</div>
                    <ul className="mt-3 space-y-2 text-[13px] text-slate-700">
                        {insights.low.length ? (
                        insights.low.map((t) => (
                            <li key={t} className="flex items-start gap-2">
                            <ArrowDownRight className="mt-0.5 h-4 w-4 text-emerald-600" />
                            <span>{t}</span>
                            </li>
                        ))
                        ) : (
                        <li className="text-slate-500">No hay sedes comparables con la referencia actual.</li>
                        )}
                    </ul>
                    </div>
                </div>

                <div className="mt-4 text-[12px] text-slate-500">Unidad de consumo específico: {intensityUnit}. La referencia (m², empleados, kW o unid.) se configura por el usuario.</div>
                </div>
            </Card>

            {/* Gadget 4 + 5 */}
            <div className="grid grid-cols-1 gap-7 xl:grid-cols-2">
                <Card className="p-6 border-t-4 border-orange-200">
                <div className="flex items-start justify-between gap-3">
                    <TitleBlock kicker="Gadget 4" title="Comparar dos sedes" subtitle="Útil para validar si la diferencia es operativa o estructural." size="section" />
                    <Chip tone="slate">
                    <Building2 className="h-3.5 w-3.5 text-orange-600" />
                    Multi-unidad
                    </Chip>
                </div>

                <div className="mt-5 grid grid-cols-1 gap-3">
                    <SoftSelect label="Sede A" value={compareA} onChange={setCompareA}>
                    {dataset.rows.map((s) => (
                        <option key={s.id} value={s.id}>
                        {s.name}
                        </option>
                    ))}
                    </SoftSelect>
                    <SoftSelect label="Sede B" value={compareB} onChange={setCompareB}>
                    {dataset.rows.map((s) => (
                        <option key={s.id} value={s.id}>
                        {s.name}
                        </option>
                    ))}
                    </SoftSelect>
                </div>

                <div className="mt-5 grid grid-cols-1 gap-4">
                    {[{ s: aSite, tag: "A" }, { s: bSite, tag: "B" }].map(({ s, tag }) => (
                    <div key={tag} className="rounded-3xl bg-slate-100 p-5 ring-1 ring-slate-200">
                        <div className="flex items-start justify-between gap-2">
                        <div>
                            <div className="text-xs font-semibold text-slate-500">Sede {tag}</div>
                            <div className="mt-1 text-base font-bold text-slate-900">{s.name}</div>
                            <div className="mt-1 text-[13px] text-slate-600">{s.type} · {s.city}</div>
                        </div>
                        <Chip tone={statusChipTone(s)}>
                            {s.status === "bad" ? <AlertTriangle className="h-3.5 w-3.5" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
                            {statusLabel(s)}
                        </Chip>
                        </div>

                        <div className="mt-4 grid grid-cols-2 gap-3">
                        <div className="rounded-3xl bg-white p-4 ring-1 ring-slate-200">
                            <div className="text-xs font-semibold text-slate-500">kWh</div>
                            <div className="mt-1 text-sm font-bold text-slate-900">{fmt(s.kwh)}</div>
                        </div>
                        <div className="rounded-3xl bg-white p-4 ring-1 ring-slate-200">
                            <div className="text-xs font-semibold text-slate-500">Consumo específico</div>
                            <div className="mt-1 text-sm font-bold text-slate-900">{s.refOk ? `${fmtNorm(s.intensity)} ${intensityUnit}` : "N/D"}</div>
                        </div>
                        <div className="rounded-3xl bg-white p-4 ring-1 ring-slate-200">
                            <div className="text-xs font-semibold text-slate-500">Vs prom.</div>
                            <div className="mt-1 text-sm font-bold text-slate-900">{s.refOk ? `${fmt(s.delta * 100, 1)}%` : "—"}</div>
                        </div>
                        <div className="rounded-3xl bg-white p-4 ring-1 ring-slate-200">
                            <div className="text-xs font-semibold text-slate-500">Referencia</div>
                            <div className="mt-1 text-sm font-bold text-slate-900">{s.refOk ? `${fmt(s.ref)} ${refUnit}` : "N/D"}</div>
                        </div>
                        </div>
                    </div>
                    ))}
                </div>

                <div className="mt-5 rounded-3xl bg-orange-50/70 p-4 ring-1 ring-orange-200/80">
                    <div className="flex items-start gap-2">
                    <Info className="mt-0.5 h-4 w-4 shrink-0 text-orange-700" />
                    <div className="text-[13px] leading-relaxed text-slate-800">
                        <span className="font-semibold">Lectura simple:</span> si dos sedes similares tienen diferencias grandes, empieza por validar horarios/turnos/equipos. Luego revisa si cambió la carga o la referencia.
                    </div>
                    </div>
                </div>
                </Card>

                <Card className="p-6 border-t-4 border-orange-200">
                <div className="flex items-start justify-between gap-3">
                    <TitleBlock kicker="Gadget 5" title="Qué haría primero" subtitle="Pasos cortos para priorizar acciones entre sedes." size="section" />
                    <Chip tone="orange">
                    <Sparkles className="h-3.5 w-3.5" />
                    Operativo
                    </Chip>
                </div>

                <div className="mt-5 space-y-3">
                    <div className="rounded-3xl bg-white p-5 ring-1 ring-orange-200">
                    <div className="text-sm font-semibold text-slate-900">1) Escoger 1–2 sedes “Prioridad”</div>
                    <div className="mt-2 text-[13px] leading-relaxed text-slate-700">
                        Empieza por las sedes con mayor consumo específico. Si el proceso es el mismo, suele ser diferencia de hábitos operativos (horarios, equipos en stand-by, turnos).
                    </div>
                    </div>
                    <div className="rounded-3xl bg-white p-5 ring-1 ring-orange-200">
                    <div className="text-sm font-semibold text-slate-900">2) Comparar con una sede “En línea”</div>
                    <div className="mt-2 text-[13px] leading-relaxed text-slate-700">
                        Usa A vs B para escoger una sede similar y validar qué cambió: carga, horarios o referencia.
                    </div>
                    </div>
                    <div className="rounded-3xl bg-white p-5 ring-1 ring-orange-200">
                    <div className="text-sm font-semibold text-slate-900">3) Convertir hallazgo en acción</div>
                    <div className="mt-2 text-[13px] leading-relaxed text-slate-700">
                        Si la diferencia persiste 2–3 periodos, prioriza rutina de cierre, mantenimiento básico y control de horarios antes de pedir un estudio detallado.
                    </div>
                    </div>
                </div>

                <div className="mt-5 rounded-3xl bg-slate-100 p-5 ring-1 ring-slate-200">
                    <div className="text-sm font-semibold text-slate-900">Atajo: sedes a revisar primero</div>
                    <div className="mt-3 flex flex-wrap gap-2">
                    {dataset.rows
                        .filter((r) => r.refOk)
                        .slice(0, 3)
                        .map((r) => (
                        <button
                            key={r.id}
                            onClick={() => setSelected(r.id)}
                            className="inline-flex items-center gap-2 rounded-2xl bg-white px-3 py-2 text-xs font-semibold text-slate-800 ring-1 ring-slate-200 hover:bg-orange-200"
                        >
                            <AlertTriangle className="h-4 w-4 text-orange-600" />
                            {r.name}
                        </button>
                        ))}
                    </div>
                </div>

                <div className="mt-3 text-[11px] text-slate-500">Nota: esto es un filtro comparativo inicial. No reemplaza una auditoría energética.</div>
                </Card>
            </div>
            </div>
        </div>
        </div>
    );
    }
