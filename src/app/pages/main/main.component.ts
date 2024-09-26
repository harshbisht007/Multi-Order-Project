import { Component, Input } from '@angular/core';
import { StepperModule } from "primeng/stepper";
import { Button } from "primeng/button";
import { LoadDataComponent } from "./load-data/load-data.component";
import { SetConfigurationComponent } from "./set-configuration/set-configuration.component";
import { ManageOrdersComponent } from "./manage-orders/manage-orders.component";
import { NgClass } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    StepperModule,
    Button,
    NgClass,
    LoadDataComponent,
    SetConfigurationComponent,
    ManageOrdersComponent,
    ProgressSpinnerModule
  ],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent {
  @Input() showLoader:boolean=false;
  @Input() dataForMarker: any[] = [];
  @Input() readyZone: any;
  @Input() orderId!: number;
  activeIndex: number = 0;
  routeId: any;
  email = 'roadcast_test@roadcast.in';
  password = 'Kuchnahi';
  @Input() retrieveSecondStepData: any
  constructor(private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.onLogin()
  }
  
  onLogin() {
    this.authService.login(this.email, this.password).subscribe(
      (response) => {
      },
      (error) => {
        console.error('Login failed', error);
      }
    );
  }

  ngOnInit() {
    // // Listen for query param changes and router events
    // this.route.queryParamMap.subscribe((params: any) => {
    //   const routeId = params.get('route_id');
    //   console.log('route_id on init:', routeId);
  
    //   if (routeId) {
    //     this.activeIndex = 1; // Move to step 1 if route_id is present
    //   } else {
    //     this.activeIndex = 0; // Default to step 0 if no route_id
    //   }
    // });
  
    // // Subscribe to navigation events to handle back navigation correctly
    // this.router.events.subscribe((event) => {
    //   if (event instanceof NavigationEnd) {
    //     this.route.queryParamMap.subscribe((params: any) => {
    //       const routeId = params.get('route_id');
    //       console.log('route_id on navigation:', routeId);
  
    //       if (routeId) {
    //         this.activeIndex = 1; // Move to step 1 if route_id is present
    //       } else {
    //         this.activeIndex = 0; // Default to step 0 if no route_id
    //       }
    //     });
    //   }
    // });
  }
  
  

  setRouteId(routeId: string): void {
    this.routeId = routeId;
    this.activeIndex = 1;
  }

   reqOrderId(event: any) {
    this.orderId = event;
  }

  getData(data: any[]): void {
    this.dataForMarker = data;
  }
  zoneForRouting(event: any) {
    this.readyZone = event;
  }

  activeStepChange(stepIndex: number): void {
    this.activeIndex = stepIndex;
    console.log(this.activeIndex);
    
  }
  dataForSecondStepper(event: any) {
    this.retrieveSecondStepData = event;
  }
  goToFirstStep(): void {
    this.activeIndex = 0;
  }
}
