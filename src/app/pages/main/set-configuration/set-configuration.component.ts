import { AfterViewInit, Component, effect, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { DropdownModule } from "primeng/dropdown";
import { FormsModule } from "@angular/forms";
import { MultiSelectModule } from "primeng/multiselect";
import { InputSwitchModule } from 'primeng/inputswitch';
import { CalendarModule } from 'primeng/calendar';
import { CategoryService } from "../../../core/services/category.service";
import { Category } from "../../../graphql/generated";
import { ToggleButtonModule } from "primeng/togglebutton";
import { gql } from "apollo-angular";
import { GraphqlService } from "../../../core/services/graphql.service";
import { CommonModule, NgClass } from '@angular/common';
import { AccordionModule } from 'primeng/accordion';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TooltipModule } from 'primeng/tooltip';
import { MapComponent } from '../../map/map.component';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
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
    NgClass, InputTextModule,ToastModule,
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
export class SetConfigurationComponent implements OnInit {
  startFromHub: boolean = true;
  endAtHub: boolean = true;
  overWriteDuplicate: boolean = true;
  @Input() retrieveSecondStepData: any;
  @Output() showSpinner: EventEmitter<any> = new EventEmitter();
  @Output() dataForSecondStepper: EventEmitter<any> = new EventEmitter()
  startTime: string = '00:45';
  isDisable = true;

  categoryFields: Array<{ label: string; model: keyof ExtendedCategory; placeholder: string; id: string }> = [
    { label: 'No. of Vehicles', model: 'count', placeholder: 'Enter number of vehicles', id: 'noOfVehicles' },
    { label: 'Capacity of Each Vehicle', model: 'capacity', placeholder: 'Enter vehicle capacity', id: 'capacityOfVehicle' },
    { label: 'Max Range of Each Vehicle (In Km)', model: 'range', placeholder: 'Enter max range', id: 'maxRange' },
    { label: 'Wait Time per Stop', model: 'waitTime', placeholder: 'Enter wait time', id: 'waitTime' },
    { label: 'Total Shift Time (In Hours)', model: 'shiftTime', placeholder: 'Enter total shift time', id: 'totalShiftTime' }

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

  @Input() routeId!: any;
  isSaveDisabled: boolean = true;
  @Input() dataForMarker!: any[];
  @Input() readyZone: any
  @Output() manageOrders: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() goToPreviousStep: EventEmitter<any> = new EventEmitter<any>();
  @Output() goToFirstStep: EventEmitter<void> = new EventEmitter<void>();

  categories: Category[] = [];
  selectedCategories: any[] = [];
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
  @Output() orderId: EventEmitter<any> = new EventEmitter<any>();
  additionalFields: any;

  categoriesFromSynco: any;

  constructor(private categoryService: CategoryService, private graphqlService: GraphqlService,private messageService: MessageService) {
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
        console.log('Categories available: ', this.categories);

        // this.selectedCategories = [this.categories[0]]; 
      }
    });
  }

  ngOnInit(): void {
    if (this.retrieveSecondStepData) {
      this.startFromHub = this.retrieveSecondStepData.payload.start_from_hub;
      this.endAtHub = this.retrieveSecondStepData.payload.end_at_hub;
      this.checked = !this.retrieveSecondStepData.payload.single_batch;
      this.overWriteDuplicate = this.retrieveSecondStepData.payload.overwrite_duplicate;
      this.startTime = this.retrieveSecondStepData.payload.start_time;
      this.maxMinInput[0].value = this.retrieveSecondStepData.payload.max_orders_in_cluster;
      this.maxMinInput[1].value = this.retrieveSecondStepData.payload.min_orders_in_cluster;

      // this.selectedCategories = this.retrieveSecondStepData.vehicle_config.map((config: any) => {
      //   return {
      //     name: config.category_name,
      //     id: config.category_id,

      //   };
      // });
      this.selectedCategories = this.retrieveSecondStepData.selectedCategories
      this.additionalFields = this.retrieveSecondStepData.payload.vehicle_config.map((config: any) => {
        return {
          name: config.category_name,
          count: config.count,
          capacity: config.capacity,
          range: config.range,
          waitTime: config.wait_time_per_stop,
          shiftTime: config.shift_time
        };
      });
      if (this.additionalFields.length) {

        this.checkFormValidity()
      }
    }


    this.checkboxOptions = [
      { id: 'startHub', label: 'Start from Hub', model: this.startFromHub, icon: '../../../../assets/icons/icons-info.svg', tooltip: 'Start the route from the hub.' },
      { id: 'overwrite', label: 'Overwrite Duplicate Data', model: this.overWriteDuplicate, icon: '../../../../assets/icons/icons-info.svg', tooltip: 'Overwrite any duplicate data found.' },
      { id: 'endHub', label: 'End at Hub', model: this.endAtHub, icon: '../../../../assets/icons/icons-info.svg', tooltip: 'End the route at the hub.' },
    ]
  }
  onTimeChange(event: Date) {
    const hours = event.getHours().toString().padStart(2, '0');
    const minutes = event.getMinutes().toString().padStart(2, '0');
    this.startTime = `${hours}:${minutes}`;
  }

  selectedCategory(event: any) {
    console.log(event, 'event');
    this.additionalFields = this.additionalFields || [];

    const selectedCategories = event.value;

    const selectedFieldNames = selectedCategories.map((category: any) => category.name);

    this.additionalFields = this.additionalFields.filter((field: any) =>
      selectedFieldNames.includes(field.name)
    );

    const newFields = selectedCategories
      .filter((category: any) => !this.additionalFields.some((field: any) => field.name === category.name))
      .map((category: any) => ({
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
    this.goToPreviousStep.emit(true)
  }

  async runRouting() {
    this.showSpinner.emit(true)
    const mutation = gql`
      mutation run_routing($id: Int!) {  
        run_routing(route_id: $id)
      }
    `;
    try{
      const res = await this.graphqlService.runMutation(mutation, {
        id: this.routeId
      });
      if(res){
        this.showSpinner.emit(false)
      }
      this.orderId.emit(res?.run_routing);
      this.manageOrders.emit(true);
    }catch(error){
      console.log(error)
      // this.showSpinner.emit(false)
    }
    this.showSpinner.emit(false)
  }

  shouldShowSpinner(event: any) {
    console.log(event, '12223')
    this.showSpinner.emit(event);
  }

  onCancel() {
    this.goToFirstStep.emit();
  }


  async saveChanges() {
    this.runRoute = true
    const mutation = gql`mutation updateRoute($id: Int!, $change: RouteInput!) {
      update_route(id: $id, change: $change) {
        id
      }
    }`
    const payload = {
      start_from_hub: this.checkboxOptions.find(option => option.id === 'startHub')?.model,
      end_at_hub: this.checkboxOptions.find(option => option.id === 'endHub')?.model,
      single_batch: !this.checked,
      overwrite_duplicate: this.checkboxOptions.find(option => option.id === 'overwrite')?.model,
      start_time: this.startTime,
      max_orders_in_cluster: this.maxMinInput[0].value,
      min_orders_in_cluster: this.maxMinInput[1].value,
      vehicle_config: this.selectedCategories.map((category, index) => {
        const additionalField = this.additionalFields[index];
        return {
          category_name: category.name,
          category_id: category.id,
          count: additionalField?.count ?? null,
          capacity: additionalField?.capacity ?? null,
          range: additionalField?.range ?? null,
          wait_time_per_stop: additionalField?.waitTime ?? null,
          shift_time: additionalField?.shiftTime ?? null,
          company_id: category.company_id
        };
      })
    }

    try {
      this.dataForSecondStepper.emit({ payload, selectedCategories: this.selectedCategories })
      const res = await this.graphqlService.runMutation(mutation, {
        id: this.routeId,
        change: payload
      });
      this.routeId = res.update_route.id;
      this.messageService.add({ severity: 'success', summary: 'Route Configuration Saved', icon: 'pi pi-check'  });

    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Error' });

      console.error('GraphQL Error:', error);
    }

  }


  showDialog() {
    this.visible = true;
  }

  checkFormValidity() {
    this.isSaveDisabled = this.additionalFields.some((category: any) => {
      return this.categoryFields.some(field => !category[field.model]);
    });
  }

}
