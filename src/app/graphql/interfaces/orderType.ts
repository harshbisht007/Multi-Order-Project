export interface Geom {
    latitude: number;
    longitude: number;
}

export interface TouchPoint {
    address: string;
    category_type: string;
    closing_time: string;
    cluster_number: number;
    company_id: string;
    created_on: string;
    customer_name: string;
    customer_phone: string;
    external_id: string;
    geom: Geom;
    id: number;
    opening_time: string;
    pincode: string;
    routing_id: number;
    shipment_id: string;
    touch_point_type: string;
    updated_on: string;
    weight: number;
}

export interface TouchPointDetails {
    batch_id: number;
    id: number;
    priority: number;
    total_km: number;
    total_load: number;
    touch_point: TouchPoint;
    touch_point_id: number;
    customer_name?: string;
}

export interface Batch {
    category_id: number | null;
    category_name: string | null;
    cluster_id: number;
    duration: number;
    id: number;
    is_missed: boolean;
    rider_id: number | null;
    rider_name: string | null;
    rider_phone: string | null;
    sequence_id: number | null;
    total_km: number;
    additional_distance: number;
    total_load: number;
    touch_points: TouchPointDetails[];
    volume: number;
    isReordered?: boolean;

}

export interface Cluster {
    batches: Batch[];
    id: number;
    is_missed: boolean | null;
    order_id: number;
    sequence_id: number | null;

}

export interface HubLocation {
    latitude: number;
    longitude: number;
}

export interface Route {
    avg_speed: number;
    end_at_hub: boolean;
    hub_location: HubLocation;
    id: number;
    max_orders_in_cluster: number;
    min_orders_in_cluster: number;
    overwrite_duplicate: boolean;
    riders: number;
    single_batch: boolean;
    start_from_hub: boolean;
    start_time: string;
    zone_id: string;
}

export interface Order {
    clusters: Cluster[];
    id: number;
    route: Route;
    route_id: number;
}
