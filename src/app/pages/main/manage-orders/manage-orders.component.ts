import { AfterViewInit, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { GraphqlService } from "../../../core/services/graphql.service";
import { gql } from "apollo-angular";
import { AccordionModule } from "primeng/accordion";
import { TableModule } from "primeng/table";
import { TabViewModule } from 'primeng/tabview';
import { DropdownModule } from 'primeng/dropdown';
import { CommonModule } from '@angular/common';
import { TooltipModule } from 'primeng/tooltip';
import { MapComponent } from "../../map/map.component";
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { BatchMoveDialogComponent } from '../../batch-move-dialog/batch-move-dialog.component';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { ManageOrdersService } from '../../../core/services/manage-orders.service';
import { DialogModule } from 'primeng/dialog';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ZoneService } from '../../../core/services/zone.service';
import { ReadyZone, ReadyZoneData, zoneAPIResponse } from '../../../graphql/interfaces/zoneData';
import { BatchInfo, BatchReRun } from '../../../graphql/interfaces/batchInfo';
import { Batch, Order, Cluster, TouchPointDetails } from '../../../graphql/interfaces/orderType';
import { environment } from '../../../../environments/environment';
@Component({
  selector: 'app-manage-orders',
  standalone: true,
  imports: [
    AccordionModule, DialogModule, TooltipModule, CommonModule, ConfirmDialogModule,
    TableModule, TabViewModule, DropdownModule, ToastModule,
    MapComponent, BatchMoveDialogComponent, DragDropModule
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './manage-orders.component.html',
  styleUrl: './manage-orders.component.scss'
})
export class ManageOrdersComponent implements AfterViewInit {
  @ViewChild(MapComponent) mapComponent!: MapComponent;

  @Output() goToPreviousStep: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() goToFirstStep: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() showSpinner: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Input() readyZone!: ReadyZoneData;
  displayDialog: boolean = false;
  touchPointId!: number;
  cluster: Batch[] = [];
  reorder: boolean = false;
  visible: boolean = false;
  isMissed: boolean = false;
  activeAccordionIndex: number | number[] | null = null;
  @Input() routeId!: number;
  @Input() orderId!: number;
  order!: Order;
  batchInfo: BatchInfo[] = [];
  startFromHub!: boolean;
  endAtHub!: boolean;
  selectedZone!: ReadyZone;
  zoneId!: number;


  activeClusterTabIndex: number = 0;
  accordionState: boolean[][] = [];
  clusterIndex!: number;

  constructor(private zoneService: ZoneService, private route: ActivatedRoute, private manageOrderService: ManageOrdersService, private router: Router, private graphqlService: GraphqlService, private confirmationService: ConfirmationService, private messageService: MessageService) {
  }

  onCancel() {
    this.goToFirstStep.emit(true)
    this.messageService.add({ severity: 'error', summary: 'Cancelled' });
    const baseUrl = this.router.url.split('?')[0];
    this.router.navigate([baseUrl], { queryParams: {} });
  }

  goBack() {
    this.goToPreviousStep.emit(true);
    const baseUrl = this.router.url.split('?')[0];
    this.router.navigate([baseUrl], { queryParams: { route_id: this.order.route.id } });

  }

  async createOrder() {

    try {
      const res = await this.manageOrderService.placeOrder(this.orderId);
      this.messageService.add({ severity: 'success', summary: 'Order Created Successfully', icon: 'pi pi-check' });
      // if (environment.zone.includes('demo')) {
      //   window.location.href = 'https://synco-attendance.web.app/pages/multi-orders/pending-orders';
      // } else {
      //   window.location.href = 'https://synco.roadcast.co.in/pages/multi-orders/pending-orders';
      // }
    } catch (error) {
      console.error('GraphQL Error:', error);
      this.messageService.add({ severity: 'error', summary: 'Error', });

    }
  }

  ngOnInit() {
    this.route.queryParamMap.subscribe((params: ParamMap) => {
      const order_id = parseInt(params.get('order_id')!, 10);
      this.orderId = order_id;
    })
    // this.assignDriver = [
    //   { name: 'Assigned', code: 'assigned' },
    //   { name: 'Unassigned', code: 'unassigned' },
    //   { name: 'In Progress', code: 'inProgress' },
    // ];
  }

  async ngAfterViewInit() {

    await this.getOrder().then();
    this.zoneService.getZones(this.zoneId).subscribe(
      (data: zoneAPIResponse) => {
        this.selectedZone = data.data[0];
      },
      (error) => {
        console.error('Error fetching zones:', error); // Handle errors here
      }
    );
  }




  confirmDelete(touchPoint: TouchPointDetails, allBatches: Batch[], cuurentBatch: Batch, batchIndex: number, clusterIndex: number) {
    const isMissed = allBatches.some((element) => element.is_missed === true);

    this.confirmationService.confirm({
      message: `Are you sure you want to delete Order ${touchPoint.touch_point_id} from batch? This order will be moved to Missed Orders`,
      header: 'Are You Sure?',
      icon: 'pi pi-exclamation-triangle',

      accept: () => {
        this.deleteTouchPoint(touchPoint, isMissed, cuurentBatch.id, batchIndex, clusterIndex, cuurentBatch.additional_distance);

        this.messageService.add({ severity: 'success', summary: 'Touch point deleted', icon: 'pi pi-check' });
      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Cancelled' });
      }
    });
  }


  async deleteTouchPoint(touchPoint: TouchPointDetails, isMissed: boolean, batchId: number, batchIndex: number, clusterIndex: number, additionalDisatnce: number) {

    if (isMissed) {
      try {
        const res = await this.manageOrderService.addInMissedBatch(touchPoint.touch_point.id);
      } catch (error) {
        console.error('GraphQL Error:', error);
      }
    } else {
      try {
        const res = await this.manageOrderService.addNewMissedBatch(touchPoint.touch_point.id);
      } catch (error) {
        console.error('GraphQL Error:', error);
      }
    }

    const res = await this.manageOrderService.reRunBatching(batchId)

    await this.updateBatchProperty(res?.rerun_batch_routing, batchIndex, clusterIndex, additionalDisatnce);
    await this.getOrder(true)
  }

  openMoveDialog(touchPoint: TouchPointDetails, batch: Batch[], clusterIndex: number) {
    this.cluster = batch
    this.touchPointId = touchPoint.touch_point_id;
    this.displayDialog = true;
    this.clusterIndex = clusterIndex;

  }

  async closeDialog(event: { success: boolean, selectedBatchIndex: any, selectedBatchId: any, additional_distance: any }) {
    this.displayDialog = false;
    const { success, selectedBatchIndex, selectedBatchId, additional_distance } = event;
    if (success) {
      this.messageService.add({ severity: 'success', summary: 'Touch point successfully moved', icon: 'pi pi-check' });
      const res = await this.manageOrderService.reRunBatching(selectedBatchId)

      await this.updateBatchProperty(res?.rerun_batch_routing, selectedBatchIndex, this.clusterIndex, additional_distance);
      await this.getOrder(true)
    } else {
      this.messageService.add({ severity: 'error', summary: 'Cancelled', detail: 'Move operation was cancelled' });

    }
  }

  drop(event: CdkDragDrop<DragEvent>, batch: Batch) {
    this.reorder = true;
    moveItemInArray(batch.touch_points, event.previousIndex, event.currentIndex);
    batch.isReordered = true;
  }

  onUpdateOrder(): void {
    const updatedTouchPoints = this.getUpdatedTouchPoints();
    this.updateTouchPointOrder(updatedTouchPoints).then(response => {
      this.messageService.add({ severity: 'success', summary: 'TouchPoint Reordered Successfully', icon: 'pi pi-check' });
      this.getOrder(true)
    }).catch(error => {
      console.error('Error updating order:', error);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error' });

    });
  }

  showDialog() {
    this.order.clusters.forEach((cluster) => {
      cluster.batches.forEach((batch) => {
        if (batch.is_missed === true) {
          if (batch.touch_points.length !== 0) {
            this.visible = true;
          }
        }
      });
    });

    if (!this.visible) {
      this.createOrder()
    }
  }

  async getOrder(isUpdate?: boolean) {
    const res = await this.manageOrderService.fetchOrderDetails(this.orderId);
    if (!this.readyZone || Object.keys(this.readyZone).length === 0) {
      this.readyZone = {
        event: {
          originalEvent: { isTrusted: true },
          value: {
            active: true,
            address: '',
            agreement_template: null,
            company_id: '',
            created_on: '',
            description: '',
            geom: { coordinates: [], type: 'Polygon' },
            id: '',
            name: '',
            unique_id: '',
            updated_on: ''
          }
        },
        refrencePoint: [
          res.get_order.route.hub_location.longitude ?? 0,
          res.get_order.route.hub_location.latitude ?? 0
        ]
      };
    }

    this.zoneId = res.get_order.route.zone_id;
    this.startFromHub = res.get_order.route.start_from_hub;
    this.endAtHub = res.get_order.route.end_at_hub;
    this.order = res.get_order;

    if (!isUpdate) {

      if (this.order && this.order.clusters) {
        this.accordionState = this.order.clusters.map((cluster) =>
          cluster.batches.map(() => false));
      }
    }
    this.checkIfMissedOrder(this.order);
    this.batchInfo = this.order.clusters.map((cluster) => ({
      clusterId: cluster.id,
      batches: cluster.batches.map((batch) => ({
        data: [
          { label: 'Batch ID', value: batch.id },
          { label: 'Category', value: batch.category_name || 'N/A' },
          {
            label: 'Total Time',
            value: (() => {
              const durationInMinutes = batch.duration || 0;
              const hours = Math.floor(durationInMinutes / 60);
              const minutes = durationInMinutes % 60;

              return batch.duration?(hours ? `${hours} hours ` : '') +
                (minutes ? `${minutes} minutes` : '').trim():'N/A';
            })()
          }, { label: 'Total Distance', value: (batch.total_km + batch.additional_distance || 0) + ' Km' },
          { label: 'Total Load', value: batch.total_load || 'N/A' }
        ]
      }))
    }));
  }

  checkIfMissedOrder(data: Order) {
    this.isMissed = data.clusters.some((cluster) =>
      cluster.batches.some((batch) => batch.is_missed === true)
    );
  }



  shouldShowSpinner(event: boolean) {

    this.showSpinner.emit(event);

  }

  onClusterTabChange(index: number) {
    if (this.activeClusterTabIndex !== index) {
      this.accordionState[this.activeClusterTabIndex] = this.accordionState[this.activeClusterTabIndex].map(() => false);
    }
    this.activeClusterTabIndex = index;
    this.activeAccordionIndex = null;
  }

  async updateBatchProperty(batchData: BatchReRun, batchIndex: number, clusterIndex: number, additionalDistance: number) {
    this.batchInfo[clusterIndex]?.batches[batchIndex]?.data.forEach((item) => {
      if (item.label === 'Total Distance') {
        item.value = Math.round(batchData?.total_km + additionalDistance).toString() + ' Km'
      }
      if (item.label === 'Total Load') {
        item.value = Math.round(batchData?.total_load).toString();
      }
    });
  }

  async onOpen(event: { index: number }, clusterIndex: number, data: Batch[]) {
    const batchIndex = event.index;
    // const res = await this.manageOrderService.reRunBatching(data[batchIndex].id);
    // await this.updateBatchProperty(res?.rerun_batch_routing, batchIndex, clusterIndex);
    this.accordionState[clusterIndex] = this.accordionState[clusterIndex].map((_, index) => index === batchIndex);
    this.accordionState[clusterIndex][batchIndex] = true;
  }

  onClose(event: { index: number }, clusterIndex: number) {
    const batchIndex = event.index;
    this.accordionState[clusterIndex][batchIndex] = false;
  }

  onAccordionChange(event: number | number[]) {
    this.activeAccordionIndex = event === this.activeAccordionIndex ? null : event;
  }


  private getUpdatedTouchPoints() {
    return this.order.clusters.flatMap((cluster) =>
      cluster.batches.flatMap((batch) =>
        batch.touch_points.map((tp) => ({ id: tp.id }))
      )
    );
  }

  private async updateTouchPointOrder(touchPoints: { id: number }[]) {
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
