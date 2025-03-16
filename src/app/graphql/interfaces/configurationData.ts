export interface Coordinates {
    coordinates: number[][][];
    type: string;
}

export interface SelectedCategory {
    active: boolean;
    company_id: string;
    geom: Coordinates;
    icon: string | null;
    id: string;
    is_primary: boolean;
    name: string;
    priority: number;
    range_km: number;
    rates: any | null;
    type: string;
    weight: number;
}

export interface VehicleConfig {
    category_name: string;
    category_id: string;
    count: number | null; 
    capacity: number | null;
    range: number | null;
    wait_time_per_stop: number | null;
    shift_time: number | null;
    company_id: string;
}

export interface Payload {
    start_from_hub: boolean;
    end_at_hub: boolean;
    single_batch: boolean;
    overwrite_duplicate: boolean;
    wait_time_per_stop:number;
    start_time: string;
    max_orders_in_cluster: number;
    min_orders_in_cluster: number;
    vehicle_config: VehicleConfig[];
}

export interface ConfigurationData {
    payload: Payload;
    selectedCategories: SelectedCategory[];
}
