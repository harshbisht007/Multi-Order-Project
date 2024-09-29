import { gql } from "apollo-angular";

export const moveTouchPointToBatch = gql`
 mutation Change_touch_point_batch($toBatchId: Int!, $touchPointId: Int!) {
        change_touch_point_batch(to_batch_id: $toBatchId, touch_point_id: $touchPointId)
      }
`

export const placeOrder = gql`
mutation Place_order($orderId: Int!) {
  place_order(order_id: $orderId)
}
`
export const addInMissedBatch = gql`
        mutation Add_in_missed_batch($touchPointId: Int!) {
          add_in_missed_batch(touch_point_id: $touchPointId)
} `

export const addNewMissedBatch = gql`
mutation Add_new_missed_batch($touchPointId: Int!) {
  add_new_missed_batch(touch_point_id: $touchPointId)
} `

export const updateBatchTouchPointOrder = gql`
mutation Updates_batch_touch_point($rows: [BatchTouchPointInput!]!) {
  updates_batch_touch_point(rows: $rows) {
    priority
    id
  }
}
`;

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