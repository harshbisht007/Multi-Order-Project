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

import { DialogModule } from 'primeng/dialog';


@Component({
  selector: 'app-manage-orders',
  standalone: true,
  imports: [
    AccordionModule,DialogModule, NgClass, TooltipModule, CommonModule, ConfirmDialogModule,
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
  @Output() showSpinner: EventEmitter<any> = new EventEmitter<any>();

  @Input() readyZone: any;
  displayDialog: boolean = false;
  touchPointId!: number;
  cluster = [];
  reorder: boolean = false;
  visible: boolean =false;
  isMissed: boolean=false;;
  onCancel() {
    this.goToFirstStep.emit(true)
  }
  goBack() {
    this.goToPreviousStep.emit(true);
  }
  async createOrder() {
    const mutation = gql`
    mutation Place_order($orderId: Int!) {
    place_order(order_id: $orderId)
    }
    `
    try {
      const res = await this.graphqlService.runMutation(mutation, { orderId: this.orderId });
      this.messageService.add({ severity: 'success', summary: 'Order Created Successfully', icon: 'pi pi-check'  });

    } catch (error) {
      console.error('GraphQL Error:', error);
      this.messageService.add({ severity: 'error', summary: 'Error', });

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
    const isMissed = batch.some((element: any) => element.is_missed === true);

    this.confirmationService.confirm({
      message: `Are you sure you want to delete Order ${touchPoint.touch_point_id} from batch? This order will be moved to Missed Orders`,
      header: 'Are You Sure?',
      icon: 'pi pi-exclamation-triangle',

      accept: () => {
        // Code to delete the item
        this.deleteTouchPoint(touchPoint, isMissed);

        // Optionally show a success message
        this.messageService.add({ severity: 'success', summary: 'Touch point deleted', icon: 'pi pi-check'  });
      },
      reject: () => {
        // Optionally show a cancel message
        this.messageService.add({ severity: 'error', summary: 'Cancelled' });
      }
    });
  }


  async deleteTouchPoint(touchPoint: any, isMissed: boolean) {

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
    this.touchPointId = touchPoint.touch_point_id;
    this.displayDialog = true;
  }

  closeDialog(result: boolean) {
    this.displayDialog = false;
    if (result) {
      this.messageService.add({ severity: 'success', summary: 'Touch point successfully moved', icon: 'pi pi-check'  });
      this.getOrder()
    } else {
      this.messageService.add({ severity: 'error', summary: 'Cancelled', detail: 'Move operation was cancelled' });

    }
  }

  drop(event: CdkDragDrop<any[]>, batch: any) {
    this.reorder = true;
    moveItemInArray(batch.touch_points, event.previousIndex, event.currentIndex);
    batch.isReordered = true;
  }

  onUpdateOrder(): void {
    const updatedTouchPoints = this.getUpdatedTouchPoints();
    this.updateTouchPointOrder(updatedTouchPoints).then(response => {
      this.messageService.add({ severity: 'success', summary: 'TouchPoint Reordered Successfully', icon: 'pi pi-check'  });
      this.getOrder()
    }).catch(error => {
      console.error('Error updating order:', error);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error' });

    });
  }

  private getUpdatedTouchPoints(): any[] {
    return this.order.clusters.flatMap((cluster: any) =>
      cluster.batches.flatMap((batch: any) =>
        batch.touch_points.map((tp: any) => ({ id: tp.id }))
      )
    );
  }

  private async updateTouchPointOrder(touchPoints: any[]): Promise<any> {
    const mutation = gql`
    mutation Updates_batch_touch_point($rows: [BatchTouchPointInput!]!) {
        updates_batch_touch_point(rows: $rows) {
          priority
          id
        }
      }
    `;

    const rows = touchPoints.map((tp, index) => ({
      priority: index + 1, 
      id: tp.id, 
    }));
    try {
      const response = await this.graphqlService.runMutation(mutation, { rows });
      return response;
    } catch (error) {
      throw new Error('Failed to update touch point order');
    }
  }


  showDialog() {
    if(this.isMissed){
      this.visible = true;
    }else{
      this.createOrder()
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
          priority
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
    this.order = res.get_order;
    this.checkIfMissedOrder(this.order);
    this.batchInfo = this.order?.clusters.flatMap((cluster: any) =>
      cluster.batches.map((batch: any) => [
        { label: 'Batch ID', value: batch.id },
        { label: 'Order Volume', value: batch.volume || 'N/A' },
        { label: 'Category', value: batch.category_name || 'N/A' },
        { label: 'Total Distance', value: (batch.distance || 0) + ' Km' },
        { label: 'Estimated Time', value: (batch.duration ? (batch.duration / 60).toFixed(2) : '0.00') + ' Hrs' }
      ])
    );

  }

  checkIfMissedOrder(data: any) {
    this.isMissed = data.clusters.some((cluster: any) => 
      cluster.batches.some((batch: any) => batch.is_missed === true)
    );
  }

  shouldShowSpinner(event:any){
    this.showSpinner.emit(event);

  }

  
}
