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
import { ToastModule } from 'primeng/toast';
import { BatchMoveDialogComponent } from '../../batch-move-dialog/batch-move-dialog.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';


@Component({
  selector: 'app-manage-orders',
  standalone: true,
  imports: [
    AccordionModule, NgClass, TooltipModule, CommonModule, ConfirmDialogModule,
    TableModule, TabViewModule, DropdownModule, ToastModule,
    MapComponent, BatchMoveDialogComponent, DragDropModule
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './manage-orders.component.html',
  styleUrl: './manage-orders.component.scss'
})
export class ManageOrdersComponent implements AfterViewInit {
  @Output() goToPreviousStep: EventEmitter<any> = new EventEmitter<any>();
  @Output() goToFirstStep: EventEmitter<any> = new EventEmitter<any>();
  @Input() readyZone: any;
  displayDialog: boolean = false;
  touchPointId!: number;
  cluster = [];
  reorder: boolean = false;
  onCancel() {
    this.goToFirstStep.emit(true)
  }
  goBack() {
    this.goToPreviousStep.emit(true);
  }
  async createOrder() {
    const mutation=gql `
    mutation Place_order($orderId: Int!) {
    place_order(order_id: $orderId)
    }
    `
    try {
      const res = await this.graphqlService.runMutation(mutation, { orderId: this.orderId });
      console.log(res);
    } catch (error) {
      console.error('GraphQL Error:', error);
    }
  }
  activeTabIndex: number | null = null;

  // assignDriver: { name: string, code: string }[] = [];
  @Input() routeId!: string;
  @Input() orderId!: number;
  order!: any;
  batchInfo: any = []
  constructor(private graphqlService: GraphqlService, private confirmationService: ConfirmationService, private messageService: MessageService) {
  }

  ngOnInit() {
    console.log(this.readyZone, '122 ')
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

  confirmDelete(touchPoint: any, batch: any) {
    console.log(touchPoint, batch, '122')
    const isMissed = batch.some((element: any) => element.is_missed === true);

    this.confirmationService.confirm({
      message: `Are you sure you want to delete Order ${touchPoint.id} from batch? This order will be moved to Missed Orders`,
      header: 'Are You Sure?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        // Code to delete the item
        this.deleteTouchPoint(touchPoint, isMissed);

        // Optionally show a success message
        this.messageService.add({ severity: 'success', summary: 'Confirmed', detail: 'Touch point deleted' });
      },
      reject: () => {
        // Optionally show a cancel message
        this.messageService.add({ severity: 'error', summary: 'Cancelled'});
      }
    });
  }


  async deleteTouchPoint(touchPoint: any, isMissed: boolean) {

    console.log(touchPoint, isMissed, '122')
    if (isMissed) {

      const mutation = gql`
        mutation Add_in_missed_batch($touchPointId: Int!) {
        add_in_missed_batch(touch_point_id: $touchPointId)
      } `
      try {
        const res = await this.graphqlService.runMutation(mutation, { touchPointId: touchPoint.touch_point.id });
        console.log(res);
      } catch (error) {
        console.error('GraphQL Error:', error);
      }
    } else {

      const mutation = gql`
       mutation Add_new_missed_batch($touchPointId: Int!) {
      add_new_missed_batch(touch_point_id: $touchPointId)
      } `
      try {
        const res = await this.graphqlService.runMutation(mutation, { touchPointId: touchPoint.touch_point.id });
        console.log(res);
      } catch (error) {
        console.error('GraphQL Error:', error);
      }
    }
    await this.getOrder()
  }

  openMoveDialog(touchPoint: any, batch: any) {
    this.cluster = batch
    this.touchPointId = touchPoint.id;
    this.displayDialog = true;
  }

  closeDialog(result: boolean) {
    this.displayDialog = false;
    if (result) {
      this.messageService.add({ severity: 'success', summary: 'Confirmed', detail: 'Touch point successfully moved' });
      this.getOrder()
    } else {
      this.messageService.add({ severity: 'error', summary: 'Cancelled', detail: 'Move operation was cancelled' });

    }
  }

  drop(event: CdkDragDrop<any[]>, batch: any) {
    this.reorder = true;
    moveItemInArray(batch.touch_points, event.previousIndex, event.currentIndex);
  }

  onUpdateOrder(): void {
    const updatedTouchPoints = this.getUpdatedTouchPoints();
    console.log(updatedTouchPoints, '122')
    this.updateTouchPointOrder(updatedTouchPoints).then(response => {
      console.log('Order updated successfully', response);
    }).catch(error => {
      console.error('Error updating order:', error);
    });
  }

  private getUpdatedTouchPoints(): any[] {
    return this.order.clusters.flatMap((cluster: any) =>
      cluster.batches.flatMap((batch: any) =>
        batch.touch_points.map((tp: any) => ({ touch_point_id: tp.touch_point.id, batch_id: tp.batch_id }))
      )
    );
  }

  private async updateTouchPointOrder(touchPoints: any[]): Promise<any> {
    const mutation = gql`
      mutation Updates_batch_touch_point($rows: [BatchTouchPointInput!]!) {
        updates_batch_touch_point(rows: $rows) {
          priority
          batch_id
          touch_point_id
        }
      }
    `;

    // Map the touchPoints array to match the expected input structure
    const rows = touchPoints.map((tp, index) => ({
      priority: index + 1, // Update priority based on new order (starting from 1)
      batch_id: tp.batch_id, // Assuming batch_id is available in each touch point
      touch_point_id: tp.touch_point_id // Assuming touch_point_id is available
    }));
    console.log(rows)
    return;
    try {
      // Execute the mutation with the actual touch points data
      const response = await this.graphqlService.runMutation(mutation, { rows });
      return response;
    } catch (error) {
      throw new Error('Failed to update touch point order');
    }
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
