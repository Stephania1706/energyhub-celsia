"use client";
import React, { useMemo, useRef, useState } from "react";
import {
    CalendarClock,
    Download,
    FileText,
    Info,
    Leaf,
    LineChart,
    MapPin,
    Sparkles,
    Target,
    TrendingDown,
    TrendingUp,
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
    tone?: "slate" | "orange" | "green" | "red";
}) {
    const tones: Record<string, string> = {
        slate: "bg-slate-50 text-slate-700 ring-slate-200",
        orange: "bg-orange-50 text-orange-700 ring-orange-200",
        green: "bg-emerald-50 text-emerald-700 ring-emerald-200",
        red: "bg-red-50 text-red-700 ring-red-200",
    };
    return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${tones[tone]}`}>{children}</span>
    );
}

    function PrimaryBtn({
    children,
    onClick,
    }: {
    children: React.ReactNode;
    onClick?: () => void;
    }) {
    return (
        <button
        onClick={onClick}
        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-orange-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-700"
        >
        {children}
        </button>
    );
    }

    function SoftBtn({ children }: { children: React.ReactNode }) {
    return (
        <button className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50">
        {children}
        </button>
    );
    }

    function TitleBlock({ kicker, title, subtitle }: { kicker: string; title: string; subtitle?: string }) {
    return (
        <div>
        <div className="text-xs font-semibold text-slate-500">{kicker}</div>
        <div className="mt-1 text-2xl font-bold tracking-tight text-slate-900">{title}</div>
        {subtitle ? <div className="mt-1 text-[13px] leading-relaxed text-slate-600">{subtitle}</div> : null}
        </div>
    );
    }

    function Metric({
    label,
    value,
    hint,
    tone = "slate",
    icon,
    }: {
    label: string;
    value: string;
    hint: string;
    tone?: "slate" | "orange" | "green" | "red";
    icon: React.ReactNode;
    }) {
    const bg: Record<string, string> = {
        slate: "bg-slate-50 text-slate-700 ring-slate-200",
        orange: "bg-orange-50 text-orange-700 ring-orange-200",
        green: "bg-emerald-50 text-emerald-700 ring-emerald-200",
        red: "bg-red-50 text-red-700 ring-red-200",
    };

    return (
        <div className="rounded-3xl bg-white p-4 ring-1 ring-slate-200">
        <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
            <div className="text-xs font-semibold text-slate-500">{label}</div>
            <div className="mt-1 text-xl font-bold tracking-tight text-slate-900">{value}</div>
            <div className="mt-1 text-[12px] text-slate-600">{hint}</div>
            </div>
            <div className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ring-1 ${bg[tone]}`}>{icon}</div>
        </div>
        </div>
    );
    }

    function fmt(n: number, digits = 0) {
    return n.toLocaleString("es-CO", { maximumFractionDigits: digits, minimumFractionDigits: digits });
    }

    function MiniBars({ values }: { values: number[] }) {
    const max = Math.max(...values, 1);
    return (
        <div className="flex h-12 items-end gap-1">
        {values.map((v, i) => (
            <div
            key={i}
            className="w-4 rounded-full bg-orange-400/60"
            style={{ height: `${Math.max(10, Math.round((v / max) * 100))}%` }}
            title={`${v}`}
            />
        ))}
        </div>
    );
    }

    function MiniSparkline({ values }: { values: number[] }) {
    const w = 300;
    const h = 36;
    const max = Math.max(...values, 1);
    const min = Math.min(...values, 0);
    const dx = w / (values.length - 1);
    const scaleY = (v: number) => {
        if (max === min) return h / 2;
        return h - ((v - min) / (max - min)) * h;
    };
    const d = values
        .map((v, i) => {
        const x = i * dx;
        const y = scaleY(v);
        return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
        })
        .join(" ");

    return (
        <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="overflow-visible">
        <path d={d} fill="none" stroke="rgba(249,115,22,0.75)" strokeWidth={2.5} strokeLinecap="round" />
        </svg>
    );
    }

    // ------------------------------------------------------------
    // Mock data
    // ------------------------------------------------------------

    type Site = { id: string; name: string; city: string; segment: string };

    export default function Mockup52xReporteEjecutivoDescargable() {
    const reportRef = useRef<HTMLDivElement | null>(null);
    const [exportMsg, setExportMsg] = useState<string | null>(null);

    const handleDownloadPDF = () => {
        setExportMsg(null);

        const node = reportRef.current;
        if (!node) {
        setExportMsg("No se encontró la hoja del reporte para exportar.");
        return;
        }

        // 1) Intento preferido: imprimir solo la hoja usando un iframe (más confiable que window.print en algunos previews)
        try {
        const html = `
            <html>
            <head>
                <meta charset="utf-8" />
                <title>Reporte ejecutivo</title>
                <style>
                @page { size: A4; margin: 14mm; }
                body { font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; background: #ffffff; }
                /* Evitar sombras/rings raros al imprimir */
                .print-clean { box-shadow: none !important; }
                </style>
            </head>
            <body>
                ${node.outerHTML}
                <script>
                setTimeout(function(){ window.focus(); window.print(); }, 150);
                </script>
            </body>
            </html>
        `;

        const iframe = document.createElement("iframe");
        iframe.style.position = "fixed";
        iframe.style.right = "0";
        iframe.style.bottom = "0";
        iframe.style.width = "0";
        iframe.style.height = "0";
        iframe.style.border = "0";
        document.body.appendChild(iframe);

        const doc = iframe.contentWindow && iframe.contentWindow.document;
        if (!doc) throw new Error("No se pudo abrir el documento de impresión");

        doc.open();
        doc.write(html);
        doc.close();

        setExportMsg("Se abrió la impresión del reporte. Si no la ves, revisa el bloqueador de ventanas emergentes.");

        setTimeout(() => {
            try {
            document.body.removeChild(iframe);
            } catch {}
        }, 3000);

        return;
        } catch {
        // continúa al fallback
        }

        // 2) Fallback: descargar el reporte como HTML (lo abres y guardas como PDF)
        try {
        const safePeriod = model.period.split(" ").join("_");
        const safeSite = model.site.name.split(" ").join("_");

        const htmlFile = `<!doctype html><html><head><meta charset="utf-8" />
            <title>Reporte ejecutivo</title>
            <style>
            @page { size: A4; margin: 14mm; }
            body { font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; background: #ffffff; }
            </style>
        </head><body>${node.outerHTML}</body></html>`;

        const blob = new Blob([htmlFile], { type: "text/html;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `Reporte_ejecutivo_${safeSite}_${safePeriod}.html`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);

        setExportMsg("Descargué el reporte. Ábrelo y usa Imprimir → Guardar como PDF.");
        } catch {
        setExportMsg("Este entorno bloqueó la exportación. Como alternativa, usa Ctrl+P / Cmd+P.");
        }
    };

    const [period, setPeriod] = useState("Febrero 2026");
    const [siteId, setSiteId] = useState("S3");
    const [includeCost, setIncludeCost] = useState(true);
    const [includeSustainability, setIncludeSustainability] = useState(true);

    const sites: Site[] = useMemo(
        () => [
        { id: "S3", name: "Planta Acopi 01", city: "Cali", segment: "Industrial" },
        { id: "S6", name: "Planta Agro 02", city: "Palmira", segment: "Agroindustrial" },
        { id: "S1", name: "Bodega Yumbo 01", city: "Yumbo", segment: "Logística" },
        ],
        []
    );

    const model = useMemo(() => {
        const site = sites.find((s) => s.id === siteId) || sites[0];

        // Valores ilustrativos coherentes con un reporte ejecutivo (1 página)
        const kwh = site.id === "S3" ? 22150 : site.id === "S6" ? 18780 : 9820;
        const kwhPrev = Math.round(kwh * (site.id === "S3" ? 0.92 : site.id === "S6" ? 1.06 : 0.98));
        const avg12 = Math.round(kwh * (site.id === "S3" ? 0.97 : site.id === "S6" ? 0.99 : 1.02));

        const pctVsPrev = ((kwh - kwhPrev) / Math.max(kwhPrev, 1)) * 100;
        const pctVs12 = ((kwh - avg12) / Math.max(avg12, 1)) * 100;

        const outOfHoursPct = site.id === "S3" ? 18.5 : site.id === "S6" ? 24.2 : 14.1;
        const peakHour = site.id === "S3" ? "14:00–16:00" : site.id === "S6" ? "10:00–12:00" : "09:00–11:00";

        const estCost = Math.round(kwh * (site.id === "S3" ? 980 : site.id === "S6" ? 1010 : 920));
        const costPrev = Math.round(estCost * (site.id === "S3" ? 0.95 : site.id === "S6" ? 1.04 : 0.99));
        const pctCost = ((estCost - costPrev) / Math.max(costPrev, 1)) * 100;

        const co2 = Math.round((kwh * 0.18) / 1000); // tCO2e ilustrativo

        // minicharts
        const days = site.id === "S6" ? [82, 78, 80, 79, 83, 60, 58] : [92, 90, 91, 89, 93, 70, 66];
        const months = site.id === "S3" ? [18.9, 19.3, 18.4, 19.7, 20.2, 21.0, 20.5, 19.9, 20.6, 21.2, 20.8, 21.6] : [16.5, 16.2, 16.9, 17.3, 17.8, 18.1, 18.7, 18.4, 18.0, 18.9, 19.1, 19.4];

        const keyFinding =
        outOfHoursPct >= 22
            ? "Tu principal oportunidad está en el consumo fuera de horario."
            : pctVsPrev > 5
            ? "Se observa un aumento relevante frente al mes anterior."
            : "El consumo se mantiene dentro del comportamiento esperado.";

        const explain =
        outOfHoursPct >= 22
            ? `Aproximadamente el ${fmt(outOfHoursPct, 1)}% del consumo ocurrió fuera de horario. Prioriza revisión de equipos que quedan encendidos y rutinas de cierre.`
            : `El consumo cambió ${pctVsPrev >= 0 ? "↑" : "↓"} ${fmt(Math.abs(pctVsPrev), 1)}% vs el mes anterior. Revisa si hubo cambios operativos (turnos, producción, riego, refrigeración).`;

        const actions = [
        {
            t: "1) Ajustar rutinas de cierre",
            d: `Enfocar en los bloques de mayor consumo fuera de horario y validar responsables por turno.`,
        },
        {
            t: "2) Validar equipos críticos",
            d: `Revisar motores, bombas, compresores o refrigeración en la franja ${peakHour}.`,
        },
        {
            t: "3) Seguimiento 2–3 meses",
            d: "Si el patrón persiste, prioriza un plan de acción (mantenimiento, control horario, ajustes operativos).",
        },
        ];

        return {
        site,
        period,
        kwh,
        kwhPrev,
        avg12,
        pctVsPrev,
        pctVs12,
        outOfHoursPct,
        peakHour,
        estCost,
        pctCost,
        co2,
        days,
        months,
        keyFinding,
        explain,
        actions,
        reportId: `REP-${site.id}-${period.replace(/\s/g, "").slice(0, 3).toUpperCase()}-01`,
        generatedAt: "Hoy · 16:10",
        };
    }, [period, siteId, sites]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-100 text-slate-900">
        <style>{`
            @media print {
            body { background: #ffffff !important; }
            body * { visibility: hidden !important; }
            #report-page, #report-page * { visibility: visible !important; }
            #report-page {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
            }
            }
        `}</style>
        <div className="w-full space-y-5">
            {/* Header */}
            <Card className="overflow-hidden border-t-4 border-orange-200">
            <div className="bg-gradient-to-r from-orange-50 via-white to-white p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-700 ring-1 ring-orange-200/80">
                    <FileText className="h-6 w-6" />
                    </div>
                    <TitleBlock
                    kicker="Funcionalidad 5.2.x"
                    title="Reporte ejecutivo descargable"
                    subtitle="Resumen mensual (1 página) para gerencia: consumo, comparativos, hallazgo principal y acciones sugeridas."
                    />
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <Chip tone="slate">
                    <CalendarClock className="h-3.5 w-3.5 text-orange-600" />
                    {model.generatedAt}
                    </Chip>
                    <Chip tone="slate">
                    <Info className="h-3.5 w-3.5 text-orange-600" />
                    {model.reportId}
                    </Chip>
                    {exportMsg ? (
                    <span className="text-[12px] font-semibold text-slate-600">{exportMsg}</span>
                    ) : null}
                    <PrimaryBtn onClick={handleDownloadPDF}>
                    <Download className="h-4 w-4" />
                    Descargar PDF
                    </PrimaryBtn>
                    <SoftBtn>
                    <Sparkles className="h-4 w-4 text-orange-600" />
                    Vista previa
                    </SoftBtn>
                </div>
                </div>

                <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-3xl bg-white p-3 ring-1 ring-slate-200">
                    <div className="text-xs font-semibold text-slate-500">Periodo</div>
                    <select
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                    className="mt-1 w-full bg-transparent text-sm font-semibold text-slate-900 outline-none"
                    >
                    <option>Febrero 2026</option>
                    <option>Enero 2026</option>
                    <option>Diciembre 2025</option>
                    </select>
                </div>

                <div className="rounded-3xl bg-white p-3 ring-1 ring-slate-200">
                    <div className="text-xs font-semibold text-slate-500">Sede</div>
                    <select
                    value={siteId}
                    onChange={(e) => setSiteId(e.target.value)}
                    className="mt-1 w-full bg-transparent text-sm font-semibold text-slate-900 outline-none"
                    >
                    {sites.map((s) => (
                        <option key={s.id} value={s.id}>
                        {s.name}
                        </option>
                    ))}
                    </select>
                </div>

                <div className="rounded-3xl bg-white p-4 ring-1 ring-slate-200">
                    <div className="flex items-center justify-between gap-3">
                    <div>
                        <div className="text-xs font-semibold text-slate-500">Incluir costos</div>
                        <div className="mt-1 text-[13px] text-slate-600">CU estimado + variación</div>
                    </div>
                    <button
                        onClick={() => setIncludeCost((v) => !v)}
                        className={`relative h-7 w-12 rounded-full ring-1 ring-slate-200 transition ${includeCost ? "bg-orange-500/80" : "bg-slate-200"}`}
                        aria-label="Incluir costos"
                    >
                        <div className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow-sm transition ${includeCost ? "left-6" : "left-0.5"}`} />
                    </button>
                    </div>
                </div>

                <div className="rounded-3xl bg-white p-4 ring-1 ring-slate-200">
                    <div className="flex items-center justify-between gap-3">
                    <div>
                        <div className="text-xs font-semibold text-slate-500">Sostenibilidad</div>
                        <div className="mt-1 text-[13px] text-slate-600">Indicadores (CO₂e)</div>
                    </div>
                    <button
                        onClick={() => setIncludeSustainability((v) => !v)}
                        className={`relative h-7 w-12 rounded-full ring-1 ring-slate-200 transition ${includeSustainability ? "bg-orange-500/80" : "bg-slate-200"}`}
                        aria-label="Sostenibilidad"
                    >
                        <div className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow-sm transition ${includeSustainability ? "left-6" : "left-0.5"}`} />
                    </button>
                    </div>
                </div>
                </div>
            </div>
            </Card>

            {/* Preview (1 página) */}
            <Card className="p-6 border-t-4 border-orange-200">
            <div className="flex items-start justify-between gap-3">
                <TitleBlock kicker="Vista previa" title="Reporte mensual (1 página)" subtitle="Diseñado para imprimir o enviar por correo a líderes." />
                <Chip tone="slate">
                <MapPin className="h-3.5 w-3.5 text-orange-600" />
                {model.site.city} · {model.site.segment}
                </Chip>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-[1fr_380px] ">
                {/* Page */}
                
                <div id="report-page" ref={reportRef} className=" w-full rounded-2xl bg-white p-7 shadow-sm ring-1 ring-slate-200">
                    {/* Page header */}
                    <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                        <div className="text-xs font-semibold text-slate-500">Reporte ejecutivo de energía</div>
                        <div className="mt-1 text-2xl font-bold tracking-tight text-slate-900">{model.site.name}</div>
                        <div className="mt-1 text-[13px] text-slate-600">Periodo: {model.period} · ID: {model.reportId}</div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 me-5">
                        <Chip tone="orange">
                        <Zap className="h-3.5 w-3.5" />
                        Consumo
                        </Chip>
                        {includeCost ? (
                        <Chip tone="slate">
                            <LineChart className="h-3.5 w-3.5 text-orange-600" />
                            Costo
                        </Chip>
                        ) : null}
                        {includeSustainability ? (
                        <Chip tone="green">
                            <Leaf className="h-3.5 w-3.5" />
                            Sostenibilidad
                        </Chip>
                        ) : null}
                    </div>
                    

                    {/* KPIs */}
                    <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4 items-stretch w-full">
                    <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200 h-full flex flex-col justify-between">
                        <div>
                        <div className="text-xs font-semibold text-slate-500">Consumo</div>
                        <div className="mt-1 text-xl font-bold text-slate-900">{fmt(model.kwh)} kWh</div>
                        </div>
                        <div className="mt-2 text-[12px] text-slate-600">Mes actual</div>
                    </div>
                    <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200 h-full flex flex-col justify-between">
                        <div>
                        <div className="text-xs font-semibold text-slate-500">Vs mes anterior</div>
                        <div className="mt-1 flex items-center gap-2 text-xl font-bold text-slate-900">
                            {model.pctVsPrev >= 0 ? <TrendingUp className="h-5 w-5 text-orange-600" /> : <TrendingDown className="h-5 w-5 text-emerald-600" />}
                            {fmt(Math.abs(model.pctVsPrev), 1)}%
                        </div>
                        </div>
                        <div className="mt-2 text-[12px] text-slate-600">Comparativo</div>
                    </div>
                    <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200 h-full flex flex-col justify-between">
                        <div>
                        <div className="text-xs font-semibold text-slate-500">Vs promedio 12m</div>
                        <div className="mt-1 text-xl font-bold text-slate-900">{fmt(model.pctVs12 >= 0 ? model.pctVs12 : -model.pctVs12, 1)}%</div>
                        </div>
                        <div className="mt-2 text-[12px] text-slate-600">Referencia histórica</div>
                    </div>
                    {includeCost ? (
                        <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200 h-full flex flex-col justify-between">
                        <div>
                            <div className="text-xs font-semibold text-slate-500">Costo estimado</div>
                            <div className="mt-1 text-xl font-bold text-slate-900">${fmt(model.estCost)}</div>
                        </div>
                        <div className="mt-2 text-[12px] text-slate-600">{fmt(Math.abs(model.pctCost), 1)}% vs mes ant.</div>
                        </div>
                    ) : (
                        <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200 h-full flex flex-col justify-between">
                        <div>
                            <div className="text-xs font-semibold text-slate-500">Pico de consumo</div>
                            <div className="mt-1 text-xl font-bold text-slate-900">{model.peakHour}</div>
                        </div>
                        <div className="mt-2 text-[12px] text-slate-600">Franja principal</div>
                        </div>
                    )}
                    </div>

                    {/* Main finding */}
                    <div className="w-full mt-6 rounded-2xl bg-orange-50/70 p-5 ring-1 ring-orange-200/80">
                    <div className="text-sm font-bold text-slate-900">{model.keyFinding}</div>
                    <div className="mt-2 text-[13px] leading-relaxed text-slate-700">{model.explain}</div>
                    </div>

                    {/* Charts row */}
                    <div className="w-full mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2 ">
                    <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
                        <div className="flex items-center justify-between">
                        <div className="text-m font-semibold text-slate-500">Patrón semanal</div>
                        <div className="text-m font-semibold text-slate-600">(últimos 7 días)</div>
                        </div>
                        <div className="mt-3 flex items-center justify-between gap-2">
                        <MiniBars values={model.days} />
                        <div className="text-right text-[14px] text-slate-600">
                            <div><span className="font-semibold text-slate-900">Fuera horario:</span> {fmt(model.outOfHoursPct, 1)}%</div>
                            <div><span className="font-semibold text-slate-900">Pico:</span> {model.peakHour}</div>
                        </div>
                        </div>
                    </div>

                    <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
                        <div className="flex items-center justify-between">
                        <div className="text-m font-semibold text-slate-500">Tendencia 12 meses</div>
                        <div className="text-m font-semibold text-slate-600">(kWh)</div>
                        </div>
                        <div className="mt-3 flex items-center justify-between gap-3">
                        <MiniSparkline values={model.months} />
                        <div className="text-right text-[14px] text-slate-600">
                            <div><span className="font-semibold text-slate-900">Prom. 12m:</span> {fmt(model.avg12)} kWh</div>
                            <div><span className="font-semibold text-slate-900">Mes ant.:</span> {fmt(model.kwhPrev)} kWh</div>
                        </div>
                        </div>
                    </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-[1fr_0.9fr]">
                    <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200 w-100">
                        <div className="text-xs font-semibold text-slate-500">Qué haría primero</div>
                        <div className="mt-3 space-y-3">
                        {model.actions.map((a) => (
                            <div key={a.t} className="rounded-2xl bg-slate-50 p-3 ring-1 ring-slate-200">
                            <div className="text-sm font-semibold text-slate-900">{a.t}</div>
                            <div className="mt-1 text-[13px] leading-relaxed text-slate-700">{a.d}</div>
                            </div>
                        ))}
                        </div>
                    </div>

                    <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
                        <div className="text-xs font-semibold text-slate-500">Resumen para gerencia</div>
                        <div className="mt-3 text-[13px] leading-relaxed text-slate-700">
                        <span className="font-semibold text-slate-900">Consumo:</span> {fmt(model.kwh)} kWh ({model.pctVsPrev >= 0 ? "↑" : "↓"} {fmt(Math.abs(model.pctVsPrev), 1)}% vs mes anterior).<br />
                        <span className="font-semibold text-slate-900">Hallazgo:</span> {model.keyFinding}<br />
                        <span className="font-semibold text-slate-900">Acción:</span> ejecutar 1–2 ajustes operativos y revisar en 2–3 periodos.
                        </div>

                        {includeSustainability ? (
                        <div className="mt-4 rounded-2xl bg-emerald-50/60 p-3 ring-1 ring-emerald-200">
                            <div className="flex items-start gap-2">
                            <Leaf className="mt-0.5 h-4 w-4 text-emerald-700" />
                            <div className="text-[13px] text-slate-800">
                                <span className="font-semibold">Sostenibilidad:</span> estimación {model.co2} tCO₂e asociadas al consumo del periodo (indicador ilustrativo).
                            </div>
                            </div>
                        </div>
                        ) : null}

                        <div className="mt-4 text-[11px] text-slate-500">
                        Nota: reporte ejecutivo. La plataforma no reemplaza una auditoría energética.
                        </div>
                    </div>
                    </div>
                </div>
                </div>

                {/* Side panel (explica el mockup) */}
                <div className="space-y-4">
                <Card className="p-6">
                    <div className="text-xl font-bold tracking-tight text-slate-900">¿Qué incluye el PDF?</div>
                    <div className="mt-2 text-[13px] leading-relaxed text-slate-700">
                    Un resumen de <span className="font-semibold">1 página</span> que un gerente puede leer en 60–90 segundos: consumo, comparativos, hallazgo principal y acciones recomendadas.
                    </div>
                    <div className="mt-4 rounded-3xl bg-slate-50 p-4 ring-1 ring-slate-200">
                    <div className="text-sm font-semibold text-slate-900">Buenas prácticas (tesis)</div>
                    <ul className="mt-2 space-y-2 text-[13px] text-slate-700">
                        <li className="flex items-start gap-2">
                        <Target className="mt-0.5 h-4 w-4 text-orange-600" />
                        Enfoca el reporte en decisiones: “qué cambió” y “qué haría primero”.
                        </li>
                        <li className="flex items-start gap-2">
                        <Zap className="mt-0.5 h-4 w-4 text-orange-600" />
                        Evita tecnicismos: usa porcentajes y comparativos simples.
                        </li>
                        <li className="flex items-start gap-2">
                        <LineChart className="mt-0.5 h-4 w-4 text-orange-600" />
                        Máximo 2 visualizaciones pequeñas y legibles.
                        </li>
                    </ul>
                    </div>
                </Card>

                <Card className="p-6">
                    <div className="text-xl font-bold tracking-tight text-slate-900">Opciones de envío</div>
                    <div className="mt-2 text-[13px] leading-relaxed text-slate-700">
                    El usuario puede descargar y reenviar por correo, o adjuntarlo en un comité interno.
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                    <SoftBtn>
                        <Info className="h-4 w-4 text-orange-600" />
                        Enviar por correo
                    </SoftBtn>
                    <SoftBtn>
                        <Sparkles className="h-4 w-4 text-orange-600" />
                        Programar envío mensual
                    </SoftBtn>
                    </div>
                </Card>
                </div>
            </div>
            </Card>
        </div>
        </div>
    );
    }
