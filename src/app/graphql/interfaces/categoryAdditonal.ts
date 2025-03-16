import { Coordinates } from "./configurationData";

export interface CategorySecondaryType {
    active: boolean;
    company_id: string;
    geom: Coordinates;
    icon: string | null;
    id: string;
    is_primary: boolean;
    name: string;
    priority: number;
    range_km: number;
    rates: Record<string, string> | null;
    type: string;
    weight: number;
}

export interface CategoryAPIresponse{
    data:CategorySecondaryType[],
    success: boolean,
    total: number
}

export interface AdditionalField {
    name: string;
    count: number | null; // Update to allow null values
    capacity: number | null;
    range: number | null;
    waitTime: number | null;
    shiftTime: number | null;
    vehiclesCount?: number;
    __typename?: 'Category';
    id?: string
}


export interface CategoryThirdType {
    name: string;
    count: number | null;
    weight: number | null;
    range_km: number | null;
    wait_time_per_stop: number | null;
    shift_time: number | null;
}


export interface MultiSelectEvent {
    value: CategoryThirdType[];
}
