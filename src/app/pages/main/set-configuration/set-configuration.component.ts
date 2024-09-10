import {Component, EventEmitter, Input, Output} from '@angular/core';
import {DropdownModule} from "primeng/dropdown";
import {FormsModule} from "@angular/forms";
import {MultiSelectModule} from "primeng/multiselect";
import {CategoryService} from "../../../core/services/category.service";
import {Category} from "../../../graphql/generated";
import {ToggleButtonModule} from "primeng/togglebutton";
import {gql} from "apollo-angular";
import {GraphqlService} from "../../../core/services/graphql.service";
import { NgClass } from '@angular/common';
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
    DropdownModule,ButtonModule,
    NgClass,InputTextModule,
    FormsModule,
    AccordionModule,TooltipModule,
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
  singleBatch: boolean = true;
  overWriteDuplicate: boolean = true;
  startTime: string = '00:45';

  @Input() routeId!: string;
  @Output() manageOrders: EventEmitter<boolean> = new EventEmitter<boolean>();
  categories = this.categoryService.categories;
  selectedCategories: ExtendedCategory[] = [
    {
      id: 'b4bea57e-a6f9-446a-81fa-cc202db705dc',
      name: 'Category 2',
      vehiclesCount: 10,
      capacity: 100,
      range: 10,
      waitTime: 10,
      shiftTime: 10
    }
  ];
  showButton: boolean = false;
  visible: boolean = false;

  constructor(private categoryService: CategoryService, private graphqlService: GraphqlService) {
  }

  async saveChanges() {
    const mutation = gql`mutation updateRoute($id: UUID!, $change: RouteInput!) {
      update_route(id: $id, change: $change) {
        id
      }
    }`

    const res = await this.graphqlService.runMutation(mutation, {
      id: this.routeId,
      change: {
        start_from_hub: this.startFromHub,
        end_at_hub: this.endAtHub,
        single_batch: this.singleBatch,
        overwrite_duplicate: this.overWriteDuplicate,
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
    this.manageOrders.emit(true);
  }

  toggleButton(){
    this.showButton = !this.showButton;
  }
  showDialog() {
    this.visible = true;
}
}
