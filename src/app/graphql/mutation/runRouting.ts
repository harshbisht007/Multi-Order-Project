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


