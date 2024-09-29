import { gql } from "apollo-angular";

export const run_routing = gql`
      mutation run_routing($id: Int!) {  
        run_routing(route_id: $id)
      }
    `;

export const updateRoute = gql`mutation updateRoute($id: Int!, $change: RouteInput!) {
    update_route(id: $id, change: $change) {
      id
    }
  }`


export const getRouteDetails = gql`
query Get_route($getRouteId: Int!) {
get_route(id: $getRouteId) {
vehicle_config {
  category_id
  category_name
  count
  capacity
  range
  wait_time_per_stop
  shift_time
  route_id
  id
  created_on
  updated_on
  company_id
}
touch_points {
  weight
  shipment_id
  category_type
  customer_name
  customer_phone
  cluster_number
  routing_id
  address
  pincode
  geom {
    latitude
    longitude
  }
  external_id
  opening_time
  closing_time
  touch_point_type
  touch_point_status
  id
  created_on
  updated_on
  company_id
}
total_load
total_km
duration
volume
sequence_id
start_time
riders
avg_speed
start_from_hub
end_at_hub
single_batch
overwrite_duplicate
hub_location {
  latitude
  longitude
}
max_orders_in_cluster
min_orders_in_cluster
id
created_on
updated_on
company_id
}
}
`;