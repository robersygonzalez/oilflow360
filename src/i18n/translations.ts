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
      subtitle: "Barriles por día (bpd) — actualización en vivo",
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
        production: "Producción",
        actions: "Acciones",
      },
      inspect: "Inspeccionar",
      status: {
        operational: "Operativo",
        maintenance: "Mantenimiento",
        critical: "Crítico",
      },
      searchPlaceholder: "Buscar por nombre o ubicación…",
      filterAllStatuses: "Todos los estados",
    },
    modal: {
      title: "Detalle del Pozo",
      currentStatus: "Estado Actual",
      setMaintenance: "Poner en Mantenimiento",
      setOperational: "Marcar Operativo",
    },
    alerts: {
      pressureThreshold:
        "Presión de red por encima del umbral en {well} ({value} PSI)",
      maintenanceSet: "{well} puesto en mantenimiento — presión normalizada",
      operationalRestored: "{well} reactivado y marcado como operativo",
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
      subtitle: "Barrels per day (bpd) — live update",
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
        production: "Production",
        actions: "Actions",
      },
      inspect: "Inspect",
      status: {
        operational: "Operational",
        maintenance: "Maintenance",
        critical: "Critical",
      },
      searchPlaceholder: "Search by name or location…",
      filterAllStatuses: "All statuses",
    },
    modal: {
      title: "Well Detail",
      currentStatus: "Current Status",
      setMaintenance: "Set to Maintenance",
      setOperational: "Mark as Operational",
    },
    alerts: {
      pressureThreshold:
        "Network pressure above threshold at {well} ({value} PSI)",
      maintenanceSet: "{well} set to maintenance — pressure normalized",
      operationalRestored: "{well} restored and marked operational",
    },
  },
} as const satisfies Record<Language, unknown>;

export type Translation = (typeof translations)[Language];
