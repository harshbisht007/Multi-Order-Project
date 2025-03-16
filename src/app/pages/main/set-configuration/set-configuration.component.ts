import { Component, effect, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { DropdownModule } from "primeng/dropdown";
import { FormsModule } from "@angular/forms";
import { MultiSelectModule } from "primeng/multiselect";
import { InputSwitchModule } from 'primeng/inputswitch';
import { CalendarModule } from 'primeng/calendar';
import { CategoryService } from "../../../core/services/category.service";
import { Category } from "../../../graphql/generated";
import { ToggleButtonModule } from "primeng/togglebutton";
import { GraphqlService } from "../../../core/services/graphql.service";
import { CommonModule } from '@angular/common';
import { AccordionModule } from 'primeng/accordion';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TooltipModule } from 'primeng/tooltip';
import { MapComponent } from '../../map/map.component';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import moment from 'moment';
import { RunRoutingService } from '../../../core/services/run-routing.service';
import { ReadyZoneData } from '../../../graphql/interfaces/zoneData';
import { ConfigurationData, VehicleConfig } from '../../../graphql/interfaces/configurationData';
import { ShipmentData } from '../../../graphql/interfaces/shipmentData';
import { AdditionalField, CategorySecondaryType, CategoryThirdType, MultiSelectEvent } from '../../../graphql/interfaces/categoryAdditonal';
import { firstValueFrom, Subject, takeUntil, timer } from 'rxjs';
export interface ExtendedCategory extends Category {
  vehiclesCount: number;
  capacity: number;
  count: number;
  range: number;
  waitTime: number;
  shiftTime: number;
}


@Component({
  selector: 'app-set-configuration',
  standalone: true,
  imports: [
    CommonModule, IconFieldModule, InputIconModule,
    MapComponent,
    DropdownModule, ButtonModule,
    InputTextModule, ToastModule,
    FormsModule,
    CalendarModule,
    AccordionModule, TooltipModule,
    InputSwitchModule,
    AccordionModule,
    MultiSelectModule,
    ToggleButtonModule,
    DialogModule
  ],
  providers: [MessageService],
  templateUrl: './set-configuration.component.html',
  styleUrl: './set-configuration.component.scss'
})
export class SetConfigurationComponent implements OnInit, OnDestroy {
  startFromHub: boolean = true;
  endAtHub: boolean = true;
  overWriteDuplicate: boolean = true;
  @Input() retrieveSecondStepData!: ConfigurationData | null;
  @Output() showSpinner: EventEmitter<boolean> = new EventEmitter();
  @Output() dataForSecondStepper: EventEmitter<ConfigurationData> = new EventEmitter()
  startTime: any;
  isDisable: boolean = true;
  private destroy$ = new Subject<void>();

  categoryFields: Array<{ label: string; model: keyof ExtendedCategory; placeholder: string; id: string }> = [
    { label: 'Max. No. of Vehicles', model: 'count', placeholder: 'Enter number of vehicles', id: 'noOfVehicles' },
    { label: 'Max. Capacity of Each Vehicle', model: 'capacity', placeholder: 'Enter vehicle capacity', id: 'capacityOfVehicle' },
    { label: 'Max. Range of Each Vehicle (In Km)', model: 'range', placeholder: 'Enter max range', id: 'maxRange' },
    // { label: 'Maximum Wait Time per Stop', model: 'waitTime', placeholder: 'Enter wait time', id: 'waitTime' },
    { label: 'Max. Total Shift Time (In Minutes)', model: 'shiftTime', placeholder: 'Enter total shift time', id: 'totalShiftTime' }

  ];

  // singleTimeFields: Array<{ label: string; model: keyof ExtendedCategory; placeholder: string; id: string }> = [
  //   { label: 'Wait Time per Stop', model: 'waitTime', placeholder: 'Enter wait time', id: 'waitTime' },
  //   { label: 'Total Shift Time', model: 'shiftTime', placeholder: 'Enter total shift time', id: 'totalShiftTime' }
  // ];



  checkboxOptions = [
    { id: 'startHub', label: 'Start from Hub', model: this.startFromHub, icon: '../../../../assets/icons/icons-info.svg', tooltip: 'Start the route from the hub.' },
    { id: 'overwrite', label: 'Overwrite Duplicate Data', model: this.overWriteDuplicate, icon: '../../../../assets/icons/icons-info.svg', tooltip: 'Overwrite any duplicate data found.' },
    { id: 'endHub', label: 'End at Hub', model: this.endAtHub, icon: '../../../../assets/icons/icons-info.svg', tooltip: 'End the route at the hub.' },
  ];

  @Input() routeId!: number;
  isSaveDisabled: boolean = true;
  @Input() dataForMarker!: ShipmentData[];
  @Input() readyZone!: ReadyZoneData
  @Output() manageOrders: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() goToPreviousStep: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() goToFirstStep: EventEmitter<boolean> = new EventEmitter<boolean>();

  categories: Category[] = [];
  selectedCategories: CategorySecondaryType[] = [];
  additionalFields!: AdditionalField[];
  categoriesFromSynco: CategorySecondaryType[] = [];
  visible: boolean = false;
  checked: boolean = false;
  maxMinInput: Array<{ label: string, placeholder: string, value: number, src: string, tooltip: string }> = [
    {
      label: 'Max. Orders in Each Cluster',
      placeholder: 'Enter maximum orders',
      value: 0,
      src: '../../../../assets/icons/icons-info.svg',
      tooltip: 'Maximum Ordes in each Cluster'
    },
    {
      label: 'Min. Orders in Each Cluster',
      placeholder: 'Enter minimum orders',
      value: 0,
      src: '../../../../assets/icons/icons-info.svg',
      tooltip: 'Minimum Orders in each cluster'
    }
  ];
  runRoute: boolean = false;
  @Output() orderId: EventEmitter<number> = new EventEmitter<number>();

  touchPointLength!: number;
  waitTimePerStop: any;

  constructor(private categoryService: CategoryService, private graphqlService: GraphqlService, private runRoutingService: RunRoutingService,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) {
    this.categoryService.getCategories().subscribe(
      (data) => {
        this.categoriesFromSynco = data.data;
      },
      (error) => {
        console.error('Error fetching categories:', error);
      }
    );
    effect(() => {
      this.categories = this.categoryService.categories();
      if (this.categories && this.categories.length > 0) {

        // this.selectedCategories = [this.categories[0]]; 
      }
    });
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }


  async ngOnInit() {
    await this.updateRoute();
    await this.getRouteData();



    if (this.retrieveSecondStepData) {
      this.startFromHub = this.retrieveSecondStepData.payload.start_from_hub;
      this.endAtHub = this.retrieveSecondStepData.payload.end_at_hub;
      this.checked = !this.retrieveSecondStepData.payload.single_batch;
      this.overWriteDuplicate = this.retrieveSecondStepData.payload.overwrite_duplicate;
      this.startTime = this.retrieveSecondStepData.payload.start_time;
      this.maxMinInput[0].value = this.retrieveSecondStepData.payload.max_orders_in_cluster;
      this.maxMinInput[1].value = this.retrieveSecondStepData.payload.min_orders_in_cluster;
      this.waitTimePerStop=this.retrieveSecondStepData.payload.wait_time_per_stop;
      // this.selectedCategories = this.retrieveSecondStepData.vehicle_config.map((config: any) => {
      //   return {
      //     name: config.category_name,
      //     id: config.category_id,

      //   };
      // });
      this.selectedCategories = this.retrieveSecondStepData.selectedCategories
      this.additionalFields = this.retrieveSecondStepData.payload.vehicle_config.map((config) => {
        return {
          name: config.category_name,
          count: config.count,
          capacity: config.capacity,
          range: config.range,
          waitTime: config.wait_time_per_stop,
          shiftTime: config.shift_time
        };
      });
    }

    if (this.additionalFields.length) {
      this.checkFormValidity()
    }

    this.checkboxOptions = [
      { id: 'startHub', label: 'Start from Hub', model: this.startFromHub, icon: '../../../../assets/icons/icons-info.svg', tooltip: 'Start the route from the hub.' },
      { id: 'overwrite', label: 'Overwrite Duplicate Data', model: this.overWriteDuplicate, icon: '../../../../assets/icons/icons-info.svg', tooltip: 'Overwrite any duplicate data found.' },
      { id: 'endHub', label: 'End at Hub', model: this.endAtHub, icon: '../../../../assets/icons/icons-info.svg', tooltip: 'End the route at the hub.' },
    ]
  }


  async getRouteData() {
    this.route.queryParamMap.subscribe((params: ParamMap) => {
      const routeId = parseInt(params.get('route_id')!, 10);
      this.routeId = routeId;
    })


    try {
      const res = await this.runRoutingService.fetchRouteDetails(this.routeId)
      this.dataForMarker = res.get_route.touch_points;
      this.touchPointLength = res.get_route.touch_points.length;
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
            res.get_route.hub_location.longitude ?? 0,
            res.get_route.hub_location.latitude ?? 0
          ]
        };
      }

      this.checked = !res.get_route.single_batch
      const defaultTime = moment().format('HH:mm:ss');
      this.startTime = moment(res.get_route.start_time ?? defaultTime, 'HH:mm:ss').toDate();
      this.startFromHub = res.get_route.start_from_hub;
      this.overWriteDuplicate = res.get_route.overwrite_duplicate;
      this.endAtHub = res.get_route.end_at_hub
      this.waitTimePerStop=res.get_route.wait_time_per_stop;
      
      this.maxMinInput[0].value = res.get_route.max_orders_in_cluster
      this.maxMinInput[1].value = res.get_route.min_orders_in_cluster;

      if (this.categoriesFromSynco?.length > 0) {
        this.selectedCategories = this.categoriesFromSynco.filter((val) =>
          res.get_route.vehicle_config.some((config: VehicleConfig) => config.category_id === val.id)
        );
      }

      this.additionalFields = res.get_route.vehicle_config.map((config: VehicleConfig) => {
        return {
          name: config.category_name,
          count: config.count,
          capacity: config.capacity,
          range: config.range,
          waitTime: config.wait_time_per_stop,
          shiftTime: config.shift_time
        };
      });

    } catch (error) {
      console.error(error)
    }
  }

  async updateRoute() {
    if (this.readyZone) {
      try {
        await this.runRoutingService.updateRoute(this.routeId, {
          zone_id: this.readyZone.event.value.id,
          zone_name: this.readyZone.event.value.name,
          hub_location: {
            latitude: this.readyZone.refrencePoint[1],
            longitude: this.readyZone.refrencePoint[0]
          },
          company_id: this.readyZone.event.value.company_id
        })


      } catch (errror) {

      }
    }
  }
  onTimeChange(event: Date) {
    this.startTime = moment(event).format('HH:mm');

  }

  selectedCategory(event: MultiSelectEvent) {
    this.additionalFields = this.additionalFields || [];

    const selectedCategories = event.value;

    const selectedFieldNames = selectedCategories.map((category: CategoryThirdType) => category.name);

    this.additionalFields = this.additionalFields.filter((field: AdditionalField) =>
      selectedFieldNames.includes(field.name)
    );

    const newFields = selectedCategories
      .filter((category: CategoryThirdType) => !this.additionalFields.some((field) => field.name === category.name))
      .map((category: CategoryThirdType) => ({
        name: category.name,
        count: category.count || null,
        capacity: category.weight || null,
        range: category.range_km || null,
        waitTime: category.wait_time_per_stop || null,
        shiftTime: category.shift_time || null
      }));

    this.additionalFields = [...this.additionalFields, ...newFields];
  }




  goBack() {
    this.goToPreviousStep.emit(true);
    const baseUrl = this.router.url.split('?')[0];
    this.router.navigate([baseUrl], { queryParams: {} });
  }

  async runRouting() {
    this.showSpinner.emit(true)
    try {
      const res = await this.runRoutingService.getRouteTaskId(this.routeId);
      await this.runPollingForOrderStatus(res.run_routing)
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Routing Failed' });
      this.showSpinner.emit(false)
    }

  }

  async runPollingForOrderStatus(taskID: string) {
    const pollInterval = 10000;
    let isPolling = true;

    while (isPolling) {
      const res = await this.runRoutingService.fetchOrderStatus(taskID);

      if (res?.get_task_status?.state === 'SUCCESS') {
        isPolling = false;
        this.orderId.emit(res?.get_task_status?.data);
        this.manageOrders.emit(true);
        const baseUrl = this.router.url.split('?')[0];
        this.router.navigate([baseUrl], { queryParams: { order_id: res?.get_task_status?.data } });
        this.showSpinner.emit(false);
      } else if (res?.get_task_status?.state === 'FAILURE') {
        isPolling = false;
        this.messageService.add({ severity: 'error', summary: 'Routing Failed' });
        this.showSpinner.emit(false);
      } else {
        try {
          await firstValueFrom(timer(pollInterval).pipe(takeUntil(this.destroy$)));
        } catch {
          isPolling = false;
        }
      }
    }
  }

  shouldShowSpinner(event: boolean) {
    this.showSpinner.emit(event);
  }

  onCancel() {
    this.goToFirstStep.emit();
    this.messageService.add({ severity: 'error', summary: 'Cancelled' });

    const baseUrl = this.router.url.split('?')[0];
    this.router.navigate([baseUrl], { queryParams: {} });
  }
  onBatchToggle() {
    if (!this.checked) {
      this.maxMinInput[0].value = 0;
      this.maxMinInput[1].value = 0;
    }
  }

  async saveChanges() {
    if (this.touchPointLength > 100 && !this.checked) {
      return this.showMessage('error', 'Please enable multi-batch for orders with quantities greater than 100.');
    }
    const [maxOrders, minOrders] = [this.maxMinInput[0].value, this.maxMinInput[1].value];
    if (minOrders > maxOrders) {
      return this.showMessage('error', 'Minimum orders in each cluster cannot be greater than maximum order in each cluster.');
    }
    if (minOrders <= 0 && this.checked) {
      return this.showMessage('error', 'Minimum orders in each cluster must be greater than zero.');
    }
    if (maxOrders > this.touchPointLength) {
      return this.showMessage('error', 'Maximum orders in each cluster cannot exceed the total data count.');
    }
    if (minOrders > this.touchPointLength) {
      return this.showMessage('error', 'Minimum orders in each cluster cannot exceed the total data count.');
    }

    const payload = {
      start_from_hub: this.getCheckboxModel('startHub'),
      end_at_hub: this.getCheckboxModel('endHub'),
      single_batch: !this.checked,
      overwrite_duplicate: this.getCheckboxModel('overwrite'),
      start_time: this.getFormattedStartTime(),
      max_orders_in_cluster: maxOrders,
      min_orders_in_cluster: minOrders,
      wait_time_per_stop: this.waitTimePerStop,
      vehicle_config: this.buildVehicleConfig()
    };

    try {
      this.dataForSecondStepper.emit({ payload, selectedCategories: this.selectedCategories });
      const { update_route: { id } } = await this.runRoutingService.updateRoute(this.routeId, payload);
      this.routeId = id;
      this.runRoute = true;

      this.showMessage('success', 'Route Configuration Saved');
    } catch (error) {
      this.showMessage('error', 'Error');
      console.error('GraphQL Error:', error);
    }
  }

  // Helper Functions
  private showMessage(severity: string, summary: string) {
    this.messageService.add({ severity, summary, icon: severity === 'success' ? 'pi pi-check' : undefined });
  }

  private getCheckboxModel(id: string) {
    return this.checkboxOptions.find(option => option.id === id)?.model || false;
  }

  private getFormattedStartTime() {
    return moment(this.startTime, moment.ISO_8601, true).isValid()
      ? moment(this.startTime).format('HH:mm')
      : this.startTime;
  }

  private buildVehicleConfig() {
    return this.selectedCategories.map((category, index) => ({
      category_name: category.name,
      category_id: category.id,
      count: this.additionalFields[index]?.count ?? null,
      capacity: this.additionalFields[index]?.capacity ?? null,
      range: this.additionalFields[index]?.range ?? null,
      wait_time_per_stop: this.additionalFields[index]?.waitTime ?? null,
      shift_time: this.additionalFields[index]?.shiftTime ?? null,
      company_id: category.company_id
    }));
  }


  showDialog() {
    this.visible = true;
  }

  async checkFormValidity() {
    this.isSaveDisabled = !this.waitTimePerStop || 
                          this.selectedCategories.length === 0 || 
                          this.additionalFields.some((category) => 
                            this.categoryFields.some((field) => !category[field.model])
                          );
  }
  

}
