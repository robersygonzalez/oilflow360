import type { Language } from "../store/useLanguageStore";

export const translations = {
  es: {
    locale: "es-VE",
    header: {
      subtitle: "Monitoreo de Activos Petroleros",
      liveTelemetry: "TELEMETRÍA EN VIVO",
      operatorName: "R. González",
      operatorRole: "Operador Senior",
    },
    kpis: {
      productionTotal: "Producción Total",
      operationalEfficiency: "Eficiencia Operativa",
      networkPressure: "Presión de Red",
      activeAlerts: "Alertas Activas",
    },
    chart: {
      title: "Tendencia de Producción",
      subtitle: "Barriles por día (bpd) — últimas 24 horas",
      tooltipLabel: "Producción",
    },
    events: {
      title: "Registro de Eventos",
    },
    wells: {
      title: "Estado de Pozos y Activos",
      columns: {
        name: "Pozo",
        location: "Ubicación",
        status: "Estado",
        pressure: "Presión",
        temperature: "Temperatura",
        actions: "Acciones",
      },
      inspect: "Inspeccionar",
      status: {
        normal: "Normal",
        warning: "Advertencia",
        critical: "Crítico",
      },
    },
  },
  en: {
    locale: "en-US",
    header: {
      subtitle: "Oil Asset Monitoring",
      liveTelemetry: "LIVE TELEMETRY",
      operatorName: "R. Gonzalez",
      operatorRole: "Senior Operator",
    },
    kpis: {
      productionTotal: "Total Production",
      operationalEfficiency: "Operational Efficiency",
      networkPressure: "Network Pressure",
      activeAlerts: "Active Alerts",
    },
    chart: {
      title: "Production Trend",
      subtitle: "Barrels per day (bpd) — last 24 hours",
      tooltipLabel: "Production",
    },
    events: {
      title: "Event Log",
    },
    wells: {
      title: "Wells & Assets Status",
      columns: {
        name: "Well",
        location: "Location",
        status: "Status",
        pressure: "Pressure",
        temperature: "Temperature",
        actions: "Actions",
      },
      inspect: "Inspect",
      status: {
        normal: "Normal",
        warning: "Warning",
        critical: "Critical",
      },
    },
  },
} as const satisfies Record<Language, unknown>;

export type Translation = (typeof translations)[Language];
