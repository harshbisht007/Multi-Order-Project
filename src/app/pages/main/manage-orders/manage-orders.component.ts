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
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-manage-orders',
  standalone: true,
  imports: [
    AccordionModule, NgClass, TooltipModule, CommonModule,ConfirmDialogModule,
    TableModule, TabViewModule, DropdownModule,
    MapComponent
  ],
  providers:[ConfirmationService,MessageService],
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
  activeTabIndex: number | null = null;

  // assignDriver: { name: string, code: string }[] = [];
  @Input() routeId!: string;
  @Input() orderId!: number;
  order!: any;
  batchInfo: any = []
  constructor(private graphqlService: GraphqlService,private confirmationService: ConfirmationService, private messageService: MessageService) {
  }

  ngOnInit() {
    console.log(this.readyZone,'122 ')
    // this.assignDriver = [
    //   { name: 'Assigned', code: 'assigned' },
    //   { name: 'Unassigned', code: 'unassigned' },
    //   { name: 'In Progress', code: 'inProgress' },
    // ];
  }

  ngAfterViewInit() {
    this.getOrder().then();
  }
  onTabChange(event: any) {
    this.activeTabIndex = event === this.activeTabIndex ? null : event;
  }

  confirmDelete(touchPoint: any) {
    console.log(touchPoint,'122')
    this.confirmationService.confirm({
      message: `Are you sure you want to delete Order ${touchPoint.id} from batch? This order will be moved to Missed Orders`,
      header: 'Are You Sure?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        // Code to delete the item
        this.deleteTouchPoint(touchPoint);
        
        // Optionally show a success message
        this.messageService.add({ severity: 'success', summary: 'Confirmed', detail: 'Touch point deleted' });
      },
      reject: () => {
        // Optionally show a cancel message
        this.messageService.add({ severity: 'info', summary: 'Cancelled', detail: 'Delete action cancelled' });
      }
    });
  }
  
  deleteTouchPoint(touchPoint: any) {
    // Logic to remove the touchPoint from the batch
    //Update Batch
    console.log(touchPoint,'122')
    // this.batch.touch_points = this.batch.touch_points.filter(tp => tp !== touchPoint);
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
    this.order = res.get_order;
    this.batchInfo = this.order?.clusters.flatMap((cluster: any) =>
      cluster.batches.map((batch: any) => [
        { label: 'Batch ID', value: batch.id },
        { label: 'Order Volume', value: batch.volume || 'N/A' },
        { label: 'Category', value: batch.category_name || 'N/A' },
        { label: 'Total Distance', value: (batch.distance || 0) + ' Km' },
        { label: 'Estimated Time', value: (batch.duration ? (batch.duration / 60).toFixed(2) : '0.00') + ' Hrs' }
      ])
    );
    
    console.log(this.batchInfo, '122')
  }
}
