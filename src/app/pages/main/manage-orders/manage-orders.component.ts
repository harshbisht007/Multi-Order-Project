import { AfterViewInit, Component, EventEmitter, Input, Output } from '@angular/core';
import { GraphqlService } from "../../../core/services/graphql.service";
import { gql } from "apollo-angular";
import { AccordionModule } from "primeng/accordion";
import { TableModule } from "primeng/table";
import { TabViewModule } from 'primeng/tabview';
import { DropdownModule } from 'primeng/dropdown';
import { CommonModule, NgClass } from '@angular/common';
import { TooltipModule } from 'primeng/tooltip';
import { MapComponent } from "../../map/map.component";
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { BatchMoveDialogComponent } from '../../batch-move-dialog/batch-move-dialog.component';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { ManageOrdersService } from '../../../core/services/manage-orders.service';
import { DialogModule } from 'primeng/dialog';
import { Router } from '@angular/router';


@Component({
  selector: 'app-manage-orders',
  standalone: true,
  imports: [
    AccordionModule, DialogModule, NgClass, TooltipModule, CommonModule, ConfirmDialogModule,
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
  visible: boolean = false;
  isMissed: boolean = false;
  activeTabIndex: number | null = null;
  // assignDriver: { name: string, code: string }[] = [];
  @Input() routeId!: string;
  @Input() orderId!: number;
  order!: any;
  batchInfo: any = []

  constructor(private manageOrderService: ManageOrdersService, private router: Router, private graphqlService: GraphqlService, private confirmationService: ConfirmationService, private messageService: MessageService) {
  }

  onCancel() {
    this.goToFirstStep.emit(true)
  }

  goBack() {
    this.goToPreviousStep.emit(true);
  }

  async createOrder() {

    try {
      const res = await this.manageOrderService.placeOrder(this.orderId);
      this.messageService.add({ severity: 'success', summary: 'Order Created Successfully', icon: 'pi pi-check' });
      window.location.href = 'https://synco-attendance.web.app/pages/multi-orders/pending-orders';
    } catch (error) {
      console.error('GraphQL Error:', error);
      this.messageService.add({ severity: 'error', summary: 'Error', });

    }
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
        this.messageService.add({ severity: 'success', summary: 'Touch point deleted', icon: 'pi pi-check' });
      },
      reject: () => {
        // Optionally show a cancel message
        this.messageService.add({ severity: 'error', summary: 'Cancelled' });
      }
    });
  }


  async deleteTouchPoint(touchPoint: any, isMissed: boolean) {

    if (isMissed) {
      try {
        const res = await this.manageOrderService.addInMissedBatch(touchPoint.touch_point.id);
        console.log(res);
      } catch (error) {
        console.error('GraphQL Error:', error);
      }
    } else {
      try {
        const res = await this.manageOrderService.addNewMissedBatch(touchPoint.touch_point.id);
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
      this.messageService.add({ severity: 'success', summary: 'Touch point successfully moved', icon: 'pi pi-check' });
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
      this.messageService.add({ severity: 'success', summary: 'TouchPoint Reordered Successfully', icon: 'pi pi-check' });
      this.getOrder()
    }).catch(error => {
      console.error('Error updating order:', error);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error' });

    });
  }

  showDialog() {
    if (this.isMissed) {
      this.visible = true;
    } else {
      this.createOrder()
    }
  }

  async getOrder() {
    const res=await this.manageOrderService.fetchOrderDetails(this.orderId);
    this.order = res.get_order;
    this.checkIfMissedOrder(this.order);
    this.batchInfo = this.order?.clusters.flatMap((cluster: any) =>
      cluster.batches.map((batch: any) => [
        { label: 'Batch ID', value: batch.id },
        { label: 'Order Volume', value: batch.volume || 'N/A' },
        { label: 'Category', value: batch.category_name || 'N/A' },
        { label: 'Total Distance', value: (batch.total_km || 0) + ' Km' },
        { label: 'Estimated Time', value: (batch.duration ? (batch.duration / 60).toFixed(2) : '0.00') + ' Hrs' },
        { label: 'Total Load', value: batch.total_load || 'N/A' }
      ])
    );

  }

  checkIfMissedOrder(data: any) {
    this.isMissed = data.clusters.some((cluster: any) =>
      cluster.batches.some((batch: any) => batch.is_missed === true)
    );
  }

  shouldShowSpinner(event: any) {
    this.showSpinner.emit(event);

  }

  private getUpdatedTouchPoints(): any[] {
    return this.order.clusters.flatMap((cluster: any) =>
      cluster.batches.flatMap((batch: any) =>
        batch.touch_points.map((tp: any) => ({ id: tp.id }))
      )
    );
  }

  private async updateTouchPointOrder(touchPoints: any[]): Promise<any> {
   
    const rows = touchPoints.map((tp, index) => ({
      priority: index + 1,
      id: tp.id,
    }));
    try {
      const response = await this.manageOrderService.updateBatchTouchPointOrder(rows);
      return response;
    } catch (error) {
      throw new Error('Failed to update touch point order');
    }
  }


}
