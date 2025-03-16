import { gql } from "apollo-angular";


export const fetchDataFromDB = gql`
query List_touch_point($equal: String ,$limit:Int) {
  list_touch_point(limit:$limit) {
    weight
    shipment_id
    category_type
    customer_name
    customer_phone
    address
    pincode
    instructions
    mode_of_payment
    total_amount
    split_amount
    external_id
    opening_time
    closing_time
    touch_point_type
    touch_point_status(equal: $equal)
    geom {
      longitude
      latitude
    }
  }
}
`;