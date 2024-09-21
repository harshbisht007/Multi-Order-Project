import { AfterViewInit, Component, EventEmitter, Input, Output } from '@angular/core';
import { GraphqlService } from "../../../core/services/graphql.service";
import { gql } from "apollo-angular";
import { Order } from "../../../graphql/generated";
import { AccordionModule } from "primeng/accordion";
import { TableModule } from "primeng/table";
import { TabViewModule } from 'primeng/tabview';
import { DropdownModule } from 'primeng/dropdown';
import { CommonModule, NgClass } from '@angular/common';
import { TooltipModule } from 'primeng/tooltip';
import { MapComponent } from "../../map/map.component";

@Component({
  selector: 'app-manage-orders',
  standalone: true,
  imports: [
    AccordionModule, NgClass, TooltipModule, CommonModule,
    TableModule, TabViewModule, DropdownModule,
    MapComponent
  ],
  templateUrl: './manage-orders.component.html',
  styleUrl: './manage-orders.component.scss'
})
export class ManageOrdersComponent implements AfterViewInit {
  @Output() goToPreviousStep: EventEmitter<any> = new EventEmitter<any>();
  @Output() goToFirstStep: EventEmitter<any> = new EventEmitter<any>();
  @Input() readyZone:any;
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
  @Input() orderId!: number;
  order!: Order;
  orderDetails: boolean = false;
  batchInfo: any = []
  constructor(private graphqlService: GraphqlService) {
  }

  ngOnInit() {
    console.log(this.readyZone,'122 ')
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
    const query = gql`query Get_order($getOrderId: Int!) {
  get_order(id: $getOrderId) {
    route {
     
      start_time
      riders
      avg_speed
      start_from_hub
      end_at_hub
      single_batch
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
          batch {
            is_missed
            sequence_id
            volume
            category_id
            category_name
            distance
            duration
            rider_id
            rider_name
            rider_phone
            cluster_id
            id
            created_on
            updated_on
            company_id
          }
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
          touch_point_id
          id
          created_on
          updated_on
          company_id
        }
        is_missed
        sequence_id
        volume
        category_id
        category_name
        distance
        duration
        rider_id
        rider_name
        rider_phone
        cluster_id
        id
      }
      is_missed
      sequence_id
      order_id
      id
    }
    route_id
    id
    created_on
    updated_on
    company_id
  }
}
 
    `

    const res = await this.graphqlService.runQuery(query, { getOrderId: this.orderId })
    console.log(res, '122')
    this.order = res.get_order.clusters[0];
    this.batchInfo = this.order?.batches.map(batch => [
      { label: 'Batch ID', value: batch.id },
      { label: 'Order Volume', value: batch.volume || 'N/A' },
      { label: 'Category', value: batch.category_name || 'N/A' },
      { label: 'Total Distance', value: batch.distance + ' Km' },
      { label: 'Estimated Time', value: (batch.duration || 0 / 60).toFixed(2) + ' Hrs' }
    ]);
    console.log(this.batchInfo, '122')
  }
}
