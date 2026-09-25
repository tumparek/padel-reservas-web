import { Injectable, Signal, signal } from '@angular/core';
import { PublicCourt } from './models/public-court.model';

const SEED_PUBLIC_COURTS: PublicCourt[] = [
  {
    id: 'public-court-1',
    name: 'Pista Central',
    type: 'indoor',
    openingTime: '08:00',
    closingTime: '22:00',
    pricePerHour: 18,
  },
  {
    id: 'public-court-2',
    name: 'Pista Norte',
    type: 'indoor',
    openingTime: '08:00',
    closingTime: '22:00',
    pricePerHour: 16,
  },
  {
    id: 'public-court-3',
    name: 'Pista Sur',
    type: 'outdoor',
    openingTime: '09:00',
    closingTime: '23:00',
    pricePerHour: 14,
  },
  {
    id: 'public-court-4',
    name: 'Pista Jardín',
    type: 'outdoor',
    openingTime: '09:00',
    closingTime: '23:00',
    pricePerHour: 15,
  },
];

@Injectable({ providedIn: 'root' })
export class PistasMockService {
  private readonly courtsSignal = signal<PublicCourt[]>(SEED_PUBLIC_COURTS);

  readonly courts: Signal<PublicCourt[]> = this.courtsSignal.asReadonly();
}
