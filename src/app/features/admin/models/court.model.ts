export type CourtType = 'indoor' | 'outdoor';
export type CourtStatus = 'activa' | 'mantenimiento';

export interface Court {
  id: string;
  name: string;
  type: CourtType;
  openingTime: string; // '08:00'
  closingTime: string; // '22:00'
  pricePerHour: number;
  status: CourtStatus;
}
