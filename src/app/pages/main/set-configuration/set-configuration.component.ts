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
    CommonModule,
    MapComponent,
    DropdownModule, ButtonModule,
    NgClass, InputTextModule,
    FormsModule,
    CalendarModule,
    AccordionModule, TooltipModule,
    InputSwitchModule,
    AccordionModule,
    MultiSelectModule,
    ToggleButtonModule,
    DialogModule
  ],
  templateUrl: './set-configuration.component.html',
  styleUrl: './set-configuration.component.scss'
})
export class SetConfigurationComponent implements OnInit {
  startFromHub: boolean = true;
  endAtHub: boolean = true;
  overWriteDuplicate: boolean = true;
  @Input() retrieveSecondStepData: any;
  @Output() dataForSecondStepper: EventEmitter<any> = new EventEmitter()
  startTime: string = '00:45';

  categoryFields: Array<{ label: string; model: keyof ExtendedCategory; placeholder: string; id: string }> = [
    { label: 'No. of Vehicles', model: 'count', placeholder: 'Enter number of vehicles', id: 'noOfVehicles' },
    { label: 'Capacity of Each Vehicle', model: 'capacity', placeholder: 'Enter vehicle capacity', id: 'capacityOfVehicle' },
    { label: 'Max Range of Each Vehicle', model: 'range', placeholder: 'Enter max range', id: 'maxRange' },
    { label: 'Wait Time per Stop', model: 'waitTime', placeholder: 'Enter wait time', id: 'waitTime' },
    { label: 'Total Shift Time', model: 'shiftTime', placeholder: 'Enter total shift time', id: 'totalShiftTime' }

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
  @Input() dataForMarker!: any[];
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

  constructor(private categoryService: CategoryService, private graphqlService: GraphqlService) {
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
      console.log(this.retrieveSecondStepData, '122')
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
    }


    this.checkboxOptions = [
      { id: 'startHub', label: 'Start from Hub', model: this.startFromHub, icon: '../../../../assets/icons/icons-info.svg', tooltip: 'Start the route from the hub.' },
      { id: 'overwrite', label: 'Overwrite Duplicate Data', model: this.overWriteDuplicate, icon: '../../../../assets/icons/icons-info.svg', tooltip: 'Overwrite any duplicate data found.' },
      { id: 'endHub', label: 'End at Hub', model: this.endAtHub, icon: '../../../../assets/icons/icons-info.svg', tooltip: 'End the route at the hub.' },
    ]
  }

  selectedCategory(event: any) {
    console.log(event, 'event');
    this.additionalFields = this.additionalFields || [];
  
    const selectedCategories = event.value;
  
    // Get the names of the fields that are currently selected in the dropdown
    const selectedFieldNames = selectedCategories.map((category: any) => category.name);
  
    // Remove fields from additionalFields that are no longer selected
    this.additionalFields = this.additionalFields.filter((field: any) =>
      selectedFieldNames.includes(field.name)
    );
  
    // Add new fields that have been selected but are not yet in additionalFields
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
  
    // Update additionalFields with the new fields
    this.additionalFields = [...this.additionalFields, ...newFields];
  }
  
  
  

  goBack() {
    this.goToPreviousStep.emit(true)
  }

  async runRouting() {
    const mutation = gql`
      mutation run_routing($id: Int!) {  
        run_routing(route_id: $id)
      }
    `;

    const res = await this.graphqlService.runMutation(mutation, {
      id: this.routeId
    });
    this.orderId.emit(res?.run_routing);
    console.log(res, '122');
    this.manageOrders.emit(true);

  }

  onCancel() {
    this.goToFirstStep.emit();
  }


  async saveChanges() {
    this.runRoute = true
    console.log(this.checkboxOptions, '122')
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
    this.dataForSecondStepper.emit({ payload, selectedCategories: this.selectedCategories })
    const res = await this.graphqlService.runMutation(mutation, {
      id: this.routeId,
      change: payload
    });
    this.routeId = res.update_route.id;
  }


  showDialog() {
    this.visible = true;
  }
}
