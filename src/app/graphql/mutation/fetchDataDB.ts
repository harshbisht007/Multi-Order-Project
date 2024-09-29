import { gql } from "apollo-angular";


export const fetchDataFromDB = gql`
 query List_shipment {
    list_touch_point {
      id
      routing_id(isNull: true)
      customer_name
      customer_phone
      geom {
        latitude
        longitude
      }
      shipment_id
      touch_point_status
      touch_point_type
      address
      external_id
      weight
      pincode
      opening_time
      closing_time
      category_type
    }
  }
`;