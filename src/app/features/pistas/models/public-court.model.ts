export type PublicCourtType = 'indoor' | 'outdoor';

export interface PublicCourt {
  id: string;
  name: string;
  type: PublicCourtType;
  openingTime: string; // '08:00'
  closingTime: string; // '22:00'
  pricePerHour: number;
}
