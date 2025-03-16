export interface ShipmentData {
  weight: number;
  shipment_id: string;
  customer_name: string;
  customer_phone: number | string;
  category_type: string;
  address: string;
  pincode: string | number;
  opening_time: string | number;
  closing_time: string | number;
  touch_point_type: string;
  latitude: number;
  longitude: number;
  external_id: number | string;
  instructions: string | number;
  geom?:Geom;
  touch_point_status?:string;
  mode_of_payment: string;
  total_amount: number;
  status?: string;
}

export interface Geom{
latitude:number;
longitude:number;
}

export interface Header {
  field: keyof ShipmentData; 
  header: string;
}

