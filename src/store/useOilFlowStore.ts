import { useEffect } from "react";
import { create } from "zustand";
import type { LocalizedText } from "../i18n/types";

export type WellStatus = "operational" | "maintenance" | "critical";

export type Well = {
  id: string;
  name: string;
  location: LocalizedText;
  status: WellStatus;
  pressure: number;
  temperature: number;
  production: number;
};

export type AlertSeverity = "info" | "warning" | "critical";

export type AlertTemplate =
  | "pressureThreshold"
  | "maintenanceSet"
  | "operationalRestored";

export type AlertEvent = {
  id: string;
  time: string;
  severity: AlertSeverity;
  message?: LocalizedText;
  template?: AlertTemplate;
  wellName?: string;
  value?: number;
};

export type ProductionPoint = {
  time: string;
  bpd: number;
};

const PRESSURE_CRITICAL_THRESHOLD = 1600;
const MAX_HISTORY_POINTS = 16;
const MAX_ALERTS = 12;
const MAINTENANCE_PRESSURE = 1400;
const MAINTENANCE_TEMPERATURE = 72;

function randomInRange(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function nowTimeLabel() {
  return new Date().toLocaleTimeString("en-GB", { hour12: false });
}

function generateId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

const initialWells: Well[] = [
  {
    id: "w-01",
    name: "Pozo Cardón IV",
    location: { es: "Cuenca de Falcón, VE", en: "Falcón Basin, VE" },
    status: "operational",
    pressure: 1420,
    temperature: 78,
    production: 3200,
  },
  {
    id: "w-02",
    name: "Pozo Bare-1X",
    location: { es: "Faja del Orinoco, VE", en: "Orinoco Belt, VE" },
    status: "operational",
    pressure: 1560,
    temperature: 88,
    production: 2800,
  },
  {
    id: "w-03",
    name: "Pozo Lagunillas-7",
    location: { es: "Lago de Maracaibo, VE", en: "Lake Maracaibo, VE" },
    status: "operational",
    pressure: 1380,
    temperature: 74,
    production: 2950,
  },
  {
    id: "w-04",
    name: "Pozo Tía Juana-12",
    location: { es: "Zulia, VE", en: "Zulia, VE" },
    status: "critical",
    pressure: 1875,
    temperature: 104,
    production: 2500,
  },
  {
    id: "w-05",
    name: "Pozo Boscán-3",
    location: { es: "Zulia, VE", en: "Zulia, VE" },
    status: "maintenance",
    pressure: 1400,
    temperature: 72,
    production: 2800,
  },
];

const initialHistory: ProductionPoint[] = [
  { time: "00:00", bpd: 13120 },
  { time: "02:00", bpd: 13340 },
  { time: "04:00", bpd: 13580 },
  { time: "06:00", bpd: 13890 },
  { time: "08:00", bpd: 14020 },
  { time: "10:00", bpd: 14180 },
  { time: "12:00", bpd: 14250 },
];

const initialAlerts: AlertEvent[] = [
  {
    id: "a-1",
    time: "09:42:11",
    severity: "critical",
    message: {
      es: "Presión de red por encima del umbral en Pozo Tía Juana-12",
      en: "Network pressure above threshold at Well Tía Juana-12",
    },
  },
  {
    id: "a-2",
    time: "09:15:47",
    severity: "warning",
    message: {
      es: "Vibración anómala detectada en bomba de Pozo Bare-1X",
      en: "Anomalous vibration detected on Well Bare-1X pump",
    },
  },
  {
    id: "a-3",
    time: "08:58:03",
    severity: "info",
    message: {
      es: "Recalibración automática de sensor completada en Pozo Boscán-3",
      en: "Automatic sensor recalibration completed at Well Boscán-3",
    },
  },
  {
    id: "a-4",
    time: "08:30:22",
    severity: "info",
    message: {
      es: "Mantenimiento preventivo programado para Pozo Lagunillas-7",
      en: "Preventive maintenance scheduled for Well Lagunillas-7",
    },
  },
  {
    id: "a-5",
    time: "07:54:16",
    severity: "warning",
    message: {
      es: "Caída temporal de telemetría en Pozo Cardón IV (restablecida)",
      en: "Temporary telemetry outage at Well Cardón IV (restored)",
    },
  },
];

type OilFlowState = {
  wells: Well[];
  history: ProductionPoint[];
  alerts: AlertEvent[];
  selectedWellId: string | null;
  selectWell: (id: string | null) => void;
  setWellStatus: (id: string, status: WellStatus) => void;
  tick: () => void;
};

export const useOilFlowStore = create<OilFlowState>((set) => ({
  wells: initialWells,
  history: initialHistory,
  alerts: initialAlerts,
  selectedWellId: null,

  selectWell: (id) => set({ selectedWellId: id }),

  setWellStatus: (id, status) =>
    set((state) => {
      const wells = state.wells.map((well) => {
        if (well.id !== id) return well;
        if (status === "maintenance") {
          return {
            ...well,
            status,
            pressure: MAINTENANCE_PRESSURE,
            temperature: MAINTENANCE_TEMPERATURE,
          };
        }
        if (status === "operational") {
          return { ...well, status, pressure: clamp(well.pressure, 1300, 1500) };
        }
        return { ...well, status };
      });

      const changedWell = wells.find((well) => well.id === id);
      if (!changedWell) {
        return { wells };
      }

      const alert: AlertEvent = {
        id: generateId("manual"),
        time: nowTimeLabel(),
        severity:
          status === "critical"
            ? "critical"
            : status === "maintenance"
              ? "warning"
              : "info",
        template:
          status === "maintenance" ? "maintenanceSet" : "operationalRestored",
        wellName: changedWell.name,
        value: Math.round(changedWell.pressure),
      };

      return {
        wells,
        alerts: [alert, ...state.alerts].slice(0, MAX_ALERTS),
      };
    }),

  tick: () =>
    set((state) => {
      const newAlerts: AlertEvent[] = [];

      const wells = state.wells.map((well) => {
        if (well.status === "maintenance") {
          const pressure = well.pressure + (MAINTENANCE_PRESSURE - well.pressure) * 0.25;
          const temperature =
            well.temperature + (MAINTENANCE_TEMPERATURE - well.temperature) * 0.25;
          const production = clamp(well.production + randomInRange(-25, 25), 500, 4000);
          return { ...well, pressure, temperature, production };
        }

        const pressure = clamp(well.pressure + randomInRange(-35, 45), 1150, 2000);
        const temperature = clamp(
          well.temperature + randomInRange(-1.5, 2.5),
          60,
          130
        );
        const production = clamp(well.production + randomInRange(-40, 40), 500, 4000);

        let status = well.status;
        if (pressure > PRESSURE_CRITICAL_THRESHOLD && well.status !== "critical") {
          status = "critical";
          newAlerts.push({
            id: generateId("auto"),
            time: nowTimeLabel(),
            severity: "critical",
            template: "pressureThreshold",
            wellName: well.name,
            value: Math.round(pressure),
          });
        }

        return { ...well, pressure, temperature, production, status };
      });

      const totalProduction = wells.reduce((sum, well) => sum + well.production, 0);
      const point: ProductionPoint = {
        time: nowTimeLabel().slice(0, 5),
        bpd: Math.round(totalProduction),
      };
      const history = [...state.history, point].slice(-MAX_HISTORY_POINTS);

      return {
        wells,
        history,
        alerts: newAlerts.length
          ? [...newAlerts, ...state.alerts].slice(0, MAX_ALERTS)
          : state.alerts,
      };
    }),
}));

export function useTelemetrySimulator(intervalMs = 3000) {
  useEffect(() => {
    const id = setInterval(() => {
      useOilFlowStore.getState().tick();
    }, intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
}
