import { Injectable, Signal, signal } from '@angular/core';
import { Court } from './models/court.model';

interface AdminKpis {
  reservasHoy: number;
  ocupacionPct: number;
  ingresosEstimados: number;
}

interface WeeklyOccupancyEntry {
  day: string;
  pct: number;
}

const SEED_COURTS: Court[] = [
  {
    id: 'court-1',
    name: 'Pista 1',
    type: 'indoor',
    openingTime: '08:00',
    closingTime: '22:00',
    pricePerHour: 18,
    status: 'activa',
  },
  {
    id: 'court-2',
    name: 'Pista 2',
    type: 'indoor',
    openingTime: '08:00',
    closingTime: '22:00',
    pricePerHour: 18,
    status: 'activa',
  },
  {
    id: 'court-3',
    name: 'Pista 3',
    type: 'outdoor',
    openingTime: '09:00',
    closingTime: '23:00',
    pricePerHour: 15,
    status: 'activa',
  },
  {
    id: 'court-4',
    name: 'Pista 4',
    type: 'outdoor',
    openingTime: '09:00',
    closingTime: '23:00',
    pricePerHour: 15,
    status: 'mantenimiento',
  },
  {
    id: 'court-5',
    name: 'Pista 5',
    type: 'indoor',
    openingTime: '08:00',
    closingTime: '22:00',
    pricePerHour: 20,
    status: 'activa',
  },
];

const SEED_KPIS: AdminKpis = {
  reservasHoy: 12,
  ocupacionPct: 68,
  ingresosEstimados: 540,
};

const SEED_WEEKLY_OCCUPANCY: WeeklyOccupancyEntry[] = [
  { day: 'Lun', pct: 55 },
  { day: 'Mar', pct: 62 },
  { day: 'Mié', pct: 70 },
  { day: 'Jue', pct: 58 },
  { day: 'Vie', pct: 80 },
  { day: 'Sáb', pct: 95 },
  { day: 'Dom', pct: 74 },
];

@Injectable({ providedIn: 'root' })
export class AdminMockService {
  private readonly courtsSignal = signal<Court[]>(SEED_COURTS);
  private readonly kpisSignal = signal<AdminKpis>(SEED_KPIS);
  private readonly weeklyOccupancySignal = signal<WeeklyOccupancyEntry[]>(SEED_WEEKLY_OCCUPANCY);

  readonly courts: Signal<Court[]> = this.courtsSignal.asReadonly();
  readonly kpis: Signal<AdminKpis> = this.kpisSignal.asReadonly();
  readonly weeklyOccupancy: Signal<WeeklyOccupancyEntry[]> = this.weeklyOccupancySignal.asReadonly();

  addCourt(court: Omit<Court, 'id'>): void {
    const newCourt: Court = { ...court, id: crypto.randomUUID() };
    this.courtsSignal.update((courts) => [...courts, newCourt]);
  }

  updateCourt(id: string, changes: Partial<Omit<Court, 'id'>>): void {
    this.courtsSignal.update((courts) =>
      courts.map((court) => (court.id === id ? { ...court, ...changes } : court)),
    );
  }

  deleteCourt(id: string): void {
    this.courtsSignal.update((courts) => courts.filter((court) => court.id !== id));
  }
}
