"use client";
import React, { useMemo, useState } from "react";
import {
    AlertTriangle,
    CalendarClock,
    CheckCircle2,
    ChevronDown,
    Clipboard,
    ClipboardCheck,
    Download,
    Info,
    MapPin,
    MessageSquareText,
    Phone,
    Shield,
    Siren,
    Sparkles,
    Wrench,
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
    tone?: "slate" | "orange" | "red" | "green";
    }) {
    const tones: Record<string, string> = {
        slate: "bg-slate-50 text-slate-700 ring-slate-200",
        orange: "bg-orange-50 text-orange-700 ring-orange-200",
        red: "bg-red-50 text-red-700 ring-red-200",
        green: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    };
    return (
        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${tones[tone]}`}>{children}</span>
    );
    }

    function SoftBtn({
    children,
    onClick,
    className = "",
    }: {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
    }) {
    return (
        <button
        onClick={onClick}
        className={`inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50 ${className}`}
        >
        {children}
        </button>
    );
    }

    function PrimaryBtn({ children, onClick, className = "" }: { children: React.ReactNode; onClick?: () => void; className?: string }) {
    return (
        <button
        onClick={onClick}
        className={`inline-flex items-center justify-center gap-2 rounded-2xl bg-orange-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-700 ${className}`}
        >
        {children}
        </button>
    );
    }

    function TitleBlock({
    kicker,
    title,
    subtitle,
    size = "section",
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
        {subtitle ? <div className="mt-1 text-sm text-slate-600">{subtitle}</div> : null}
        </div>
    );
    }

    function Field({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
    return (
        <div className="rounded-3xl bg-slate-50/60 p-4 ring-1 ring-slate-200">
        <div className="flex items-center gap-2">
            {icon ? <span className="text-orange-600">{icon}</span> : null}
            <div className="text-xs font-semibold text-slate-500">{label}</div>
        </div>
        <div className="mt-1 text-base font-bold text-slate-900">{value}</div>
        </div>
    );
    }

    function ProgressStep({ label, state }: { label: string; state: "done" | "active" | "next" }) {
    const cls =
        state === "active"
        ? "bg-orange-600 text-white ring-orange-600"
        : state === "done"
        ? "bg-emerald-50 text-emerald-800 ring-emerald-200"
        : "bg-orange-50/60 text-orange-800 ring-orange-200";

    const icon =
        label === "Diagnóstico" ? (
        <Shield className="h-4 w-4" />
        ) : label === "En atención" ? (
        <Wrench className="h-4 w-4" />
        ) : label === "Restablecimiento" ? (
        <Sparkles className="h-4 w-4" />
        ) : (
        <CheckCircle2 className="h-4 w-4" />
        );

    return (
        <div className={`flex items-center gap-2 rounded-2xl px-3 py-2 ring-1 ${cls}`}>
        <span className={state === "active" ? "text-white" : state === "done" ? "text-emerald-700" : "text-orange-700"}>{icon}</span>
        <span className="text-xs font-semibold">{label}</span>
        </div>
    );
    }

    function CopyPill({ value }: { value: string }) {
    const [copied, setCopied] = useState(false);

    const tryCopy = () => {
        // En algunos entornos (como este preview) la Clipboard API puede estar bloqueada.
        // Usamos un fallback clásico con textarea + execCommand para evitar errores en consola.
        try {
        const ta = document.createElement("textarea");
        ta.value = value;
        ta.setAttribute("readonly", "");
        ta.style.position = "fixed";
        ta.style.left = "-9999px";
        ta.style.top = "-9999px";
        document.body.appendChild(ta);
        ta.select();
        const ok = document.execCommand("copy");
        document.body.removeChild(ta);
        setCopied(Boolean(ok));
        setTimeout(() => setCopied(false), 1200);
        } catch {
        // Si no se puede copiar, al menos no rompemos la vista.
        setCopied(false);
        }
    };

    return (
        <button
        onClick={tryCopy}
        className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"
        title={`Copiar ${value}`}
        aria-label={`Copiar ${value}`}
        >
        {copied ? <ClipboardCheck className="h-4 w-4 text-emerald-600" /> : <Clipboard className="h-4 w-4 text-slate-500" />}
        <span>{copied ? "Copiado" : "Copiar reporte"}</span>
        </button>
    );
    }

    function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
    return (
        <button
        onClick={() => onChange(!checked)}
        className="flex w-full items-center justify-between gap-3 rounded-3xl bg-white p-4 ring-1 ring-slate-200 hover:bg-slate-50"
        aria-label={label}
        >
        <div className="min-w-0">
            <div className="text-sm font-semibold text-slate-900">{label}</div>
            <div className="mt-1 text-[13px] text-slate-600">Activar notificaciones para este tipo de evento.</div>
        </div>
        <div className={`relative h-7 w-12 rounded-full ring-1 ring-slate-200 transition ${checked ? "bg-orange-500/80" : "bg-slate-200"}`}>
            <div className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow-sm transition ${checked ? "left-6" : "left-0.5"}`} />
        </div>
        </button>
    );
    }

    // ------------------------------------------------------------
    // Mock (datos ilustrativos)
    // ------------------------------------------------------------

    type EventStatus = "No programado" | "Programado";

    type CrewStatus = "Diagnóstico" | "En atención" | "Restablecimiento" | "Cierre";

    export default function Mockup523CortesEventos() {
    const [showMap, setShowMap] = useState(false);
    const [report, setReport] = useState("3551033088");
    const [openChat, setOpenChat] = useState(false);
    const [notifyWhatsApp, setNotifyWhatsApp] = useState(true);
    const [notifyEmail, setNotifyEmail] = useState(false);

    const model = useMemo(() => {
        const reportId = "3551033088";

        return {
        header: {
            title: "Información de eventos del servicio y gestión de cortes",
            subtitle: "Reduce la incertidumbre con estado, causa, atención y recomendaciones operativas básicas.",
            lastUpdate: "Hoy · 12:35",
        },
        customer: {
            name: "ZONA FRANCA DEL PACIFICO S.A. USUARIO OPERADOR DE ZONA FRANCA",
            nit: "800173565-3",
            id: "2400000000",
            niu: "2800265",
            contract: "OTROSI 1 AV-168-20",
            or: "Epsa",
            orPhone: "01 8000 112115",
            voltage: "II 34.5 kV",
            serviceType: "12 Comercial",
            serviceAddress: "Kilómetro 6 Vía 0- CARRETERA YUMBO-AEROPUERTO KM 6, PALMIRA, Valle del Cauca",
            city: "PALMIRA, Valle del Cauca",
        },
        event: {
            status: "No programado" as EventStatus,
            affected: 124,
            reportId: report,
            cause: "Falla en el transformador del circuito Santa Bárbara Industrial 34,5 kV.",
            crew: "Cuadrilla BOLV-320 (2 técnicos)",
            start: "08:45",
            etr: "10:30 · 105 min",
            step: "En atención" as CrewStatus,
        },
        timeline: [
            { t: "10:42", msg: "Se detecta interrupción del servicio en el circuito reportado." },
            { t: "11:05", msg: "Equipo operativo en desplazamiento. Se confirma afectación parcial en la zona." },
            { t: "11:58", msg: "Se realiza maniobra de aislamiento. Se mantiene evento en curso." },
            { t: "12:35", msg: "En verificación de punto de falla. Estimación de restablecimiento: en evaluación." },
        ],
        recommendations: [
            {
            title: "Protege equipos críticos",
            body: "Si tienes UPS o reguladores, verifica que estén operando. Evita reconexiones manuales repetidas.",
            icon: <Shield className="h-5 w-5" />,
            },
            {
            title: "Activa tu plan de contingencia",
            body: "Si cuentas con planta o respaldo, prioriza cargas esenciales y define un responsable por turno.",
            icon: <Wrench className="h-5 w-5" />,
            },
            {
            title: "Comunica al equipo",
            body: "Informa la situación y ajusta actividades sensibles: refrigeración, despacho, producción o caja.",
            icon: <MessageSquareText className="h-5 w-5" />,
            },
        ],
        orSupport: {
            title: "Soporte del Operador de Red",
            company: "Celsia Valle S.A. E.S.P.",
            phone: "01 8000 123 456",
            report: report,
        },
        };
    }, []);

    const steps: CrewStatus[] = ["Diagnóstico", "En atención", "Restablecimiento", "Cierre"];
    const activeIndex = steps.findIndex((s) => s === model.event.step);

    return (
        <div className="min-h-screen bg-slate-100 p-6 text-slate-900">
        <div className="w-full space-y-5">
        
            {/* Header */}
            
            <Card className="overflow-hidden border-t-4 border-orange-200">
            <div className="bg-gradient-to-r from-orange-50 via-white to-white p-5">
                
                <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-700 ring-1 ring-orange-200/80">
                    <Siren className="h-6 w-6" />
                    </div>
                    
                    <TitleBlock kicker="Funcionalidad 5.2.3" title={model.header.title} subtitle={model.header.subtitle} size="page" />
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <Chip tone="slate">
                    <CalendarClock className="h-3.5 w-3.5 text-orange-600" />
                    Actualizado: {model.header.lastUpdate}
                    </Chip>
                    <SoftBtn>
                    <Download className="h-4 w-4" />
                    Descargar
                    </SoftBtn>
                </div>
                </div>
            </div>
            </Card>

            <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.10fr_0.85fr]">
            {/* LEFT */}
            <div className="space-y-5">
                {/* Estado del evento */}
                <Card className="p-8">
                <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                    
                    
                    <div className="inline-flex flex-wrap items-center gap-3 rounded-3xl bg-white p-3 ring-1 ring-orange-200">
                        <span className="px-2 text-sm font-bold text-slate-600">Reporte</span>

                        <div className="inline-flex items-center gap-2 rounded-2xl bg-slate-50 px-4 py-2.5 ring-1 ring-slate-200">
                        <select
                            value={report}
                            onChange={(e) => setReport(e.target.value)}
                            className="bg-transparent text-sm font-bold text-slate-900 outline-none"
                        >
                            <option value="3551033088">#3551033088 · Hoy 08:45</option>
                            <option value="3551033091">#3551033091 · Ayer 16:20</option>
                            <option value="3551033120">#3551033120 · 12-mar 09:10</option>
                        </select>
                        <ChevronDown className="h-4 w-4 text-slate-400" />
                        </div>

                        
                    </div>
                    </div>

                    <Chip tone="slate">
                    <Info className="h-3.5 w-3.5 text-orange-600" />
                    Referencia para seguimiento
                    </Chip>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                    <Field label="Causa" value={model.event.cause} icon={<AlertTriangle className="h-4 w-4" />} />
                    <Field label="Estado de atención" value={`Programada/Desplazamiento ${model.event.crew}`} icon={<Wrench className="h-4 w-4" />} />
                    <Field label="Inicio" value={model.event.start} icon={<CalendarClock className="h-4 w-4" />} />
                    <Field label="Restablecimiento estimado" value={model.event.etr} icon={<Sparkles className="h-4 w-4" />} />
                </div>

                <div className="mt-4">
                    <div className="text-sm font-semibold text-slate-900">Progreso</div>
                    <div className="mt-2 flex flex-wrap gap-2">
                    {steps.map((s, idx) => (
                        <ProgressStep key={s} label={s} state={idx < activeIndex ? "done" : idx === activeIndex ? "active" : "next"} />
                    ))}
                    </div>
                </div>
                </Card>

                {/* Timeline */}
                <Card className="p-5">
                <div className="flex items-center justify-between gap-3">
                    <div className="text-xl font-bold tracking-tight text-slate-900">Actualizaciones del evento</div>
                    <Chip tone="slate">
                    <CalendarClock className="h-3.5 w-3.5 text-orange-600" />
                    Timeline
                    </Chip>
                </div>

                <div className="mt-4 space-y-3">
                    {model.timeline.map((u) => (
                    <div key={u.t} className="rounded-3xl bg-slate-50 p-4 ring-1 ring-slate-200">
                        <div className="flex items-start gap-3">
                        <div className="inline-flex h-10 w-14 items-center justify-center rounded-2xl bg-white text-sm font-bold text-slate-800 ring-1 ring-slate-200">
                            {u.t}
                        </div>
                        <div className="text-[13px] leading-relaxed text-slate-700">{u.msg}</div>
                        </div>
                    </div>
                    ))}
                </div>

                <div className="mt-4 rounded-3xl bg-orange-50/70 p-4 ring-1 ring-orange-200/80">
                    <div className="flex items-start gap-2">
                    <Info className="mt-0.5 h-4 w-4 shrink-0 text-orange-700" />
                    <div className="text-[13px] leading-relaxed text-slate-800">
                        <span className="font-semibold">Mensaje clave:</span> si tienes procesos críticos, aplica plan de contingencia y activa notificaciones para el equipo.
                    </div>
                    </div>
                </div>
                </Card>
{/* Datos del servicio (abajo) */}
                <Card className="p-5">
                <div className="flex items-center justify-between gap-3">
                    <div className="text-xl font-bold tracking-tight text-slate-900">Datos del servicio</div>
                    <Chip tone="slate">
                    <Info className="h-3.5 w-3.5 text-orange-600" />
                    Usuario
                    </Chip>
                </div>

                <div className="mt-3 rounded-3xl bg-slate-50 p-4 ring-1 ring-slate-200">
                    <div className="text-sm font-semibold text-slate-900">{model.customer.name}</div>
                    <div className="mt-2 grid grid-cols-1 gap-2 text-[13px] text-slate-700">
                    <div>
                        <span className="font-semibold">NIT:</span> {model.customer.nit}
                    </div>
                    <div>
                        <span className="font-semibold">ID:</span> {model.customer.id}
                    </div>
                    <div>
                        <span className="font-semibold">NIU:</span> {model.customer.niu}
                    </div>
                    <div>
                        <span className="font-semibold">Contrato:</span> {model.customer.contract}
                    </div>
                    <div>
                        <span className="font-semibold">Operador de red:</span> {model.customer.or}
                    </div>
                    <div>
                        <span className="font-semibold">Teléfono OR:</span> {model.customer.orPhone}
                    </div>
                    <div>
                        <span className="font-semibold">Nivel de tensión:</span> {model.customer.voltage}
                    </div>
                    <div>
                        <span className="font-semibold">Tipo de servicio:</span> {model.customer.serviceType}
                    </div>
                    <div>
                        <span className="font-semibold">Dirección del servicio:</span> {model.customer.serviceAddress}
                    </div>
                    <div>
                        <span className="font-semibold">Ciudad:</span> {model.customer.city}
                    </div>
                    </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                    <PrimaryBtn>
                    <AlertTriangle className="h-4 w-4" />
                    Reportar novedad
                    </PrimaryBtn>
                    <SoftBtn>
                    <Info className="h-4 w-4 text-orange-600" />
                    Ver FAQ
                    </SoftBtn>
                </div>

                <div className="mt-3 text-[11px] text-slate-500">
                    Nota: contenido ilustrativo para el mockup. La plataforma centraliza comunicación y reduce incertidumbre.
                </div>
                </Card>
            </div>
                
            {/* RIGHT */}
            <div className="space-y-5">
                {/* Recomendaciones (arriba) */}
                <Card className="overflow-hidden border-t-4 border-orange-200">
                <div className="bg-gradient-to-r from-orange-50 via-white to-white p-5">
                    <div className="flex items-start justify-between gap-3">
                    <TitleBlock kicker="Recomendaciones" title="Qué hacer mientras se restablece" />
                    <Chip tone="orange">
                        <Sparkles className="h-3.5 w-3.5" />
                        Básico
                    </Chip>
                    </div>
                </div>

                <div className="p-5 space-y-3">
                    {model.recommendations.map((r) => (
                    <div key={r.title} className="rounded-3xl bg-white p-4 ring-1 ring-slate-200">
                        <div className="flex items-start gap-3">
                        <div className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-100 text-orange-700 ring-1 ring-orange-200/80">
                            {r.icon}
                        </div>
                        <div>
                            <div className="text-base font-semibold text-slate-900">{r.title}</div>
                            <div className="mt-2 text-[13px] leading-relaxed text-slate-700">{r.body}</div>
                        </div>
                        </div>
                    </div>
                    ))}
                </div>
                </Card>

                {/* Soporte OR */}
                <Card className="p-8">
                <div className="flex items-start gap-3">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-700 ring-1 ring-orange-200/80">
                    <Phone className="h-6 w-6" />
                    </div>
                    <div className="min-w-0">
                    <div className="text-xl font-bold tracking-tight text-slate-900">{model.orSupport.title}</div>
                    <div className="mt-1 text-sm text-slate-600">{model.orSupport.company}</div>
                    </div>
                </div>

                <div className="mt-4 space-y-2">
                    <SoftBtn className="w-full justify-start">
                    <Phone className="h-4 w-4 text-orange-600" />
                    {model.orSupport.phone}
                    </SoftBtn>
                    <SoftBtn className="w-full justify-start" onClick={() => setOpenChat((v) => !v)}>
                    <MessageSquareText className="h-4 w-4 text-orange-600" />
                    Abrir chat
                    </SoftBtn>
                    <SoftBtn className="w-full justify-start" onClick={() => setShowMap((v) => !v)}>
                    <MapPin className="h-4 w-4 text-orange-600" />
                    Ver en mapa (opcional)
                    </SoftBtn>
                </div>

                {(openChat || showMap) ? (
                    <div className="mt-4 rounded-3xl bg-slate-50 p-4 ring-1 ring-slate-200">
                    <div className="text-sm font-semibold text-slate-900">{openChat ? "Chat" : "Mapa"}</div>
                    <div className="mt-2 text-[13px] text-slate-700">
                        {openChat
                        ? "Mockup: aquí se abriría un chat para seguimiento del evento (si está disponible)."
                        : "Mockup: aquí se mostraría el punto aproximado o zona del evento (si está disponible)."}
                    </div>
                    </div>
                ) : null}

                <div className="mt-4 text-[13px] text-slate-600">
                    El número de reporte <span className="font-semibold text-slate-900">{model.orSupport.report}</span> es tu referencia para seguimiento.
                </div>
                </Card>

                {/* Notificaciones (abajo a la izquierda) */}
                <Card className="p-8">
                <div className="flex items-center justify-between gap-3">
                    <TitleBlock kicker="Notificaciones" title="Mantén al equipo informado" />
                    <Chip tone="slate">
                    <MessageSquareText className="h-3.5 w-3.5 text-orange-600" />
                    WhatsApp / Email
                    </Chip>
                </div>

                <div className="mt-4 space-y-3">
                    <Toggle checked={notifyWhatsApp} onChange={setNotifyWhatsApp} label="WhatsApp" />
                    <Toggle checked={notifyEmail} onChange={setNotifyEmail} label="Correo" />
                </div>

                <div className="mt-4 rounded-3xl bg-slate-50 p-4 ring-1 ring-slate-200">
                    <div className="text-sm font-semibold text-slate-900">Regla recomendada</div>
                    <div className="mt-2 text-[13px] leading-relaxed text-slate-700">Notificar cuando cambie el estado del evento (inicio, actualización relevante, restablecimiento).</div>
                </div>
                </Card>
            </div>

            </div>
        </div>
        </div>
    );
    }
