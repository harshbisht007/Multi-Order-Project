export interface Batch {
    id: string;
    category_name?: string;
    total_km?: number;
    total_load?: number;
}

export interface Cluster {
    id: string;
    batches: Batch[];
}

export interface BatchReRun {
    message: string
    total_km: number
    total_load: number;
}


export interface BatchInfo {
    clusterId: number;
    batches: {
        data: {
            label: string;
            value: string | number;
        }[];
    }[];
}
