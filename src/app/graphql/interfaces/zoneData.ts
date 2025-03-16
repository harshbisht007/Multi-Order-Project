import { Coordinates } from "./configurationData";

export interface ReadyZone {
  active: boolean;
  address: string;
  agreement_template: string | null;
  company_id: string;
  created_on: string;
  description: string;
  geom:Coordinates
  id: string;
  name: string;
  unique_id: string;
  updated_on: string;
}

export interface zoneAPIResponse {
  data : ReadyZone[],
  success: boolean,
  total: number
}

export interface EventData {
  originalEvent: {
    isTrusted: boolean;
  };
  value: ReadyZone;
}

export interface refrencePoint {
  refrencePoint: [number, number];
}

export interface ReadyZoneData {
  event: EventData;
  refrencePoint: [number, number];
}
