import { gql } from "apollo-angular";


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
sequence_id
start_time
riders
avg_speed
start_from_hub
end_at_hub
zone_id
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