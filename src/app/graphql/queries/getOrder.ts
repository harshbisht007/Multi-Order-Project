import { gql } from "apollo-angular";



export const getOrderDetails = gql`query Get_order($getOrderId: Int!) {
    get_order(id: $getOrderId) {
      route {
  
        start_time
        riders
        avg_speed
        start_from_hub
        end_at_hub
        single_batch
        zone_id
        overwrite_duplicate
        hub_location {
          latitude
          longitude
        }
        max_orders_in_cluster
        min_orders_in_cluster
        id
      }
      clusters {
        batches {
          touch_points {
            touch_point {
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
              id
              created_on
              updated_on
              company_id
            }
            batch_id
            priority
            touch_point_id
            id
            total_load
            total_km
          }
          is_missed
          sequence_id
          volume
          category_id
          category_name
          duration
          rider_id
          rider_name
          rider_phone
          cluster_id
          total_load
          total_km
          additional_distance
          start_at_hub
          end_at_hub
          id
        }
        is_missed
        sequence_id
        order_id
        id
      }
      route_id
      id
    }
  }
  
  `


export const reRunBatching = gql`
query Query($batchId: Int!) {
  rerun_batch_routing(batch_id: $batchId)
}
`