import { AfterViewInit, Component, EventEmitter, Input, Output } from '@angular/core';
import { GraphqlService } from "../../../core/services/graphql.service";
import { gql } from "apollo-angular";
import { Order } from "../../../graphql/generated";
import { AccordionModule } from "primeng/accordion";
import { TableModule } from "primeng/table";
import { TabViewModule } from 'primeng/tabview';
import { DropdownModule } from 'primeng/dropdown';
import { NgClass } from '@angular/common';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-manage-orders',
  standalone: true,
  imports: [
    AccordionModule, NgClass, TooltipModule,
    TableModule, TabViewModule, DropdownModule
  ],
  templateUrl: './manage-orders.component.html',
  styleUrl: './manage-orders.component.scss'
})
export class ManageOrdersComponent implements AfterViewInit {
  @Output() goToPreviousStep: EventEmitter<any> = new EventEmitter<any>();
  @Output() goToFirstStep: EventEmitter<any> = new EventEmitter<any>();

  onCancel() {
    this.goToFirstStep.emit(true)
  }
  goBack() {
    this.goToPreviousStep.emit(true);
  }
  createOrder() {
  }
  assignDriver: { name: string, code: string }[] = [];
  @Input() routeId!: string;
  order!: Order;
  orderDetails: boolean = false;
  constructor(private graphqlService: GraphqlService) {
  }

  ngOnInit() {
    this.assignDriver = [
      { name: 'Assigned', code: 'assigned' },
      { name: 'Unassigned', code: 'unassigned' },
      { name: 'In Progress', code: 'inProgress' },
    ];
  }

  ngAfterViewInit() {
    this.getOrder().then();
  }

  showOrders() {
    this.orderDetails = !this.orderDetails;
  }

  async getOrder() {
    const query = gql`query List_order($equal: String) {
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

    const res = await this.graphqlService.runQuery(query, { equal: this.routeId })
    console.log(res);
    this.order = res.list_order[0];
  }
}
