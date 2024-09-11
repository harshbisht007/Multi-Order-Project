import { Component, effect, EventEmitter, Input, Output } from '@angular/core';
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

export interface ExtendedCategory extends Category {
  vehiclesCount: number;
  capacity: number;
  range: number;
  waitTime: number;
  shiftTime: number;
}


@Component({
  selector: 'app-set-configuration',
  standalone: true,
  imports: [
    CommonModule,
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
export class SetConfigurationComponent {
  startFromHub: boolean = true;
  endAtHub: boolean = true;
  overWriteDuplicate: boolean = true;

  startTime: string = '00:45';

  categoryFields: Array<{ label: string; model: keyof ExtendedCategory; placeholder: string; id: string }> = [
    { label: 'No. of Vehicles', model: 'vehiclesCount', placeholder: 'Enter number of vehicles', id: 'noOfVehicles' },
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
    { id: 'endHub', label: 'End at Hub', model: this.endAtHub, icon: '../../../../assets/icons/icons-info.svg', tooltip: 'End the route at the hub.' },
    { id: 'overwrite', label: 'Overwrite Duplicate Data', model: this.overWriteDuplicate, icon: '../../../../assets/icons/icons-info.svg', tooltip: 'Overwrite any duplicate data found.' }
  ];
  
  @Input() routeId!: string;
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
  runRoute: boolean=false;



  constructor(private categoryService: CategoryService, private graphqlService: GraphqlService) {
    effect(() => {
      this.categories = this.categoryService.categories();
      if (this.categories && this.categories.length > 0) {
        console.log('Categories available: ', this.categories);

        // this.selectedCategories = [this.categories[0]]; 
      }
    });
  }

  goBack(){
    this.goToPreviousStep.emit(true)
  }

  runRouting(){
    this.manageOrders.emit(true);

  }

  onCancel(){
      this.goToFirstStep.emit();
  }

  async saveChanges() {
    this.runRoute=true
    console.log(this.checkboxOptions,'122')
    const mutation = gql`mutation updateRoute($id: UUID!, $change: RouteInput!) {
      update_route(id: $id, change: $change) {
        id
      }
    }`

    const res = await this.graphqlService.runMutation(mutation, {
      id: this.routeId,
      change: {
        start_from_hub: this.checkboxOptions.find(option => option.id === 'startHub')?.model,
        end_at_hub: this.checkboxOptions.find(option => option.id === 'endHub')?.model,
        single_batch: !this.checked,
        overwrite_duplicate: this.checkboxOptions.find(option => option.id === 'overwrite')?.model,
        start_time: this.startTime,
        vehicle_config: this.selectedCategories.map(category => {
          return {
            category_name: category.name,
            category_id: category.id,
            count: category.vehiclesCount,
            capacity: category.capacity,
            range: category.range,
            company_id: 'b4bea57e-a6f9-446a-81fa-cc202db705dc'
          }
        })
      }
    });
  }


  showDialog() {
    this.visible = true;
  }
}
