import { Component, Input } from '@angular/core';
import {StepperModule} from "primeng/stepper";
import {Button} from "primeng/button";
import {LoadDataComponent} from "./load-data/load-data.component";
import {SetConfigurationComponent} from "./set-configuration/set-configuration.component";
import {ManageOrdersComponent} from "./manage-orders/manage-orders.component";
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    StepperModule,
    Button,NgClass,
    LoadDataComponent,
    SetConfigurationComponent,
    ManageOrdersComponent
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {
@Input() dataForMarker!:[];
  activeIndex: number = 0;
  routeId: string = '832f49ed-2e96-464e-b80d-00fcb92aeec3'
  active: any;

  setRouteId(ev: string) {
    this.routeId = ev
    this.activeIndex = 1;
  }
  getData(event:any){
    this.dataForMarker=event;
  }
  activeStepChange(event:any){
    this.activeIndex=event
  }
  goToFirstStep(event:any) {
    console.log(event)
    this.activeIndex=0;
  }
}
