import {AfterViewInit, Component, Input} from '@angular/core';
import {GraphqlService} from "../../../core/services/graphql.service";
import {gql} from "apollo-angular";
import {Order} from "../../../graphql/generated";
import {AccordionModule} from "primeng/accordion";
import {TableModule} from "primeng/table";

@Component({
  selector: 'app-manage-orders',
  standalone: true,
  imports: [
    AccordionModule,
    TableModule
  ],
  templateUrl: './manage-orders.component.html',
  styleUrl: './manage-orders.component.scss'
})
export class ManageOrdersComponent implements AfterViewInit {

  @Input() routeId!: string;
  order!: Order;
  constructor(private graphqlService: GraphqlService) {
  }

  ngAfterViewInit() {
    this.getOrder().then();
  }

  async getOrder() {
    const query =gql`query List_order($equal: String) {
      list_order {
        batches {
          touch_points {
            touch_point {
              weight
              shipment_id
              pincode
              opening_time
              id
              geom {
                longitude
                latitude
              }
              external_id
              closing_time
              category_type
              address
            }
          }
          rider_phone
          rider_name
          sequence_id
          id
          duration
          distance
          category_id
          category_name
          volume
        }
        id
        created_on
        route_id(equal: $equal)
      }
    }`

    const res = await this.graphqlService.runQuery(query, {equal: this.routeId})
    console.log(res);
    this.order = res.list_order[0];
  }
}
