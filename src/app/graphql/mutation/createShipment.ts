import {gql} from "apollo-angular";


export const CreateShipment = gql`
mutation CreateShipment($data: [CustomTouchPointInput!]!) {
  create_shipments(data: $data)
}
`;