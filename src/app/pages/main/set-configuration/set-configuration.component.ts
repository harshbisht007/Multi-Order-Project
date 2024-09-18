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
import { ZoneService } from '../../../core/services/zone.service';
export interface ExtendedCategory extends Category {
  vehiclesCount: number;
  capacity: number;
  count:number;
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
export class SetConfigurationComponent implements AfterViewInit {
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
  selectedCategories: ExtendedCategory[] = [];
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



  constructor(private zoneServcie: ZoneService, private categoryService: CategoryService, private graphqlService: GraphqlService) {
    effect(() => {
      this.categories = this.categoryService.categories();
      if (this.categories && this.categories.length > 0) {
        console.log('Categories available: ', this.categories);

        // this.selectedCategories = [this.categories[0]]; 
      }
    });
  }
  ngAfterViewInit(): void {
    if (this.retrieveSecondStepData) {
      console.log(this.retrieveSecondStepData, '122')
      this.startFromHub = this.retrieveSecondStepData.start_from_hub;
      this.endAtHub = this.retrieveSecondStepData.end_at_hub;
      this.checked = !this.retrieveSecondStepData.single_batch;
      this.overWriteDuplicate = this.retrieveSecondStepData.overwrite_duplicate;
      this.startTime = this.retrieveSecondStepData.start_time;
      this.maxMinInput[0].value = this.retrieveSecondStepData.max_orders_in_cluster;
      this.maxMinInput[1].value = this.retrieveSecondStepData.min_orders_in_cluster;

      this.selectedCategories = this.retrieveSecondStepData.vehicle_config.map((config: any) => {
        return {
          name: config.category_name,
          id: config.category_id,
          count: config.count,
          capacity: config.capacity,
          range: config.range,
          company_id: config.company_id,
          waitTime: config.wait_time_per_stop,
          shiftTime: config.shift_time,
        };
      });
    }

    console.log(this.checkboxOptions, '122')

    this.checkboxOptions = [
      { id: 'startHub', label: 'Start from Hub', model: this.startFromHub, icon: '../../../../assets/icons/icons-info.svg', tooltip: 'Start the route from the hub.' },
      { id: 'overwrite', label: 'Overwrite Duplicate Data', model: this.overWriteDuplicate, icon: '../../../../assets/icons/icons-info.svg', tooltip: 'Overwrite any duplicate data found.' },
      { id: 'endHub', label: 'End at Hub', model: this.endAtHub, icon: '../../../../assets/icons/icons-info.svg', tooltip: 'End the route at the hub.' },
    ]
  }


  goBack() {
    this.goToPreviousStep.emit(true)
  }

  async runRouting() {
    this.routeId=parseInt(this.routeId)
    const mutation = gql`
      mutation run_routing($id: Int!) {  
        run_routing(route_id: $id)
      }
    `;
  
    const res = await this.graphqlService.runMutation(mutation, {
      id: this.routeId  // Ensure this is a UUID string
    });
  
    console.log(res, '122');
    this.manageOrders.emit(true);

  }

  onCancel() {
    this.goToFirstStep.emit();
  }
  ngOnInit() {

  }

  async saveChanges() {
    this.runRoute = true
    console.log(this.checkboxOptions, '122')
    const mutation = gql`mutation updateRoute($id: UUID!, $change: RouteInput!) {
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
      vehicle_config: this.selectedCategories.map(category => {
        return {
          category_name: category.name,
          category_id: category.id,
          count: category.count,
          capacity: category.capacity,
          range: category.range,
          wait_time_per_stop:category.waitTime,
          shift_time:category.shiftTime,
          company_id: 'b4bea57e-a6f9-446a-81fa-cc202db705dc'
        
        }
      })
    }
    this.dataForSecondStepper.emit(payload)
    console.log(this.routeId,'122')
    const res = await this.graphqlService.runMutation(mutation, {
      id: this.routeId,
      change: payload
    });
  }


  showDialog() {
    this.visible = true;
  }
}
