import { Component, Input } from '@angular/core';
import { StepperModule } from "primeng/stepper";
import { Button } from "primeng/button";
import { LoadDataComponent } from "./load-data/load-data.component";
import { SetConfigurationComponent } from "./set-configuration/set-configuration.component";
import { ManageOrdersComponent } from "./manage-orders/manage-orders.component";
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    StepperModule,
    Button,
    NgClass,
    LoadDataComponent,
    SetConfigurationComponent,
    ManageOrdersComponent
  ],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']  
})
export class MainComponent {
  @Input() dataForMarker:any[]=[];  
  activeIndex: number = 0;
  routeId: string = '832f49ed-2e96-464e-b80d-00fcb92aeec3';
  
  setRouteId(routeId: string): void {
    this.routeId = routeId;
    this.activeIndex = 1;
  }

  getData(data: any[]): void {
    this.dataForMarker = data;
  }

  activeStepChange(stepIndex: number): void {
    this.activeIndex = stepIndex;
  }

  goToFirstStep(): void {
    this.activeIndex = 0;
  }
}
