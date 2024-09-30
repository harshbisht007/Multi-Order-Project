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

