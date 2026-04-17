import type { ActionType } from './components/KnockBar';

export interface KnockRecord {
  id: string;
  timestamp: number;
  type: ActionType;
  lat: number | null;
  lng: number | null;
  name?: string;
  phone?: string;
  services?: string[];
  price?: string;
  notes?: string;
  repName?: string;
  appointmentDate?: string;
  appointmentTimeType?: string;
  appointmentTime?: string;
  subscriptionTier?: string;
}


export interface TerritoryRecord {
  id: string;
  label: string;
  color: string;
  layer_type: string;
  latlngs: any;
}
