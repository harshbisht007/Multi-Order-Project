import { Component, Input } from '@angular/core';
import { StepperModule } from "primeng/stepper";
import { Button } from "primeng/button";
import { LoadDataComponent } from "./load-data/load-data.component";
import { SetConfigurationComponent } from "./set-configuration/set-configuration.component";
import { ManageOrdersComponent } from "./manage-orders/manage-orders.component";
import { AuthService } from '../../core/services/auth.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import {ReadyZoneData } from '../../graphql/interfaces/zoneData';
import { ShipmentData } from '../../graphql/interfaces/shipmentData';
import { ConfigurationData } from '../../graphql/interfaces/configurationData';
@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    StepperModule,
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
  @Input() dataForMarker: ShipmentData[] = [];
  @Input() readyZone!: ReadyZoneData;
  @Input() orderId!: number;
  activeIndex: number = 0;
  routeId!: number;
  email = 'roadcast_test@roadcast.in';
  password = 'Kuchnahi';
  @Input() retrieveSecondStepData!: ConfigurationData|null;
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
    this.route.queryParams.subscribe(params => {
      if (params['auth_token']) {
        localStorage.setItem('synco_auth_token', params['auth_token']);
        
        const newUrl = this.router.createUrlTree([], {
          relativeTo: this.route,
          queryParams: { auth_token: null },
          queryParamsHandling: 'merge', 
        });
        
        this.router.navigateByUrl(newUrl);
      }
    });

    
    this.checkQueryParams();

    this.router.events
    .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd)) 
    .subscribe(() => this.checkQueryParams());
  
  }

  private checkQueryParams() {
    this.route.queryParamMap.subscribe(params => {
      const routeId = params.get('route_id');
      const orderId = params.get('order_id');

      if (routeId) {
        this.activeIndex = 1; 
      } else if (orderId) {
        this.activeIndex = 2; 
      } else {
        this.activeIndex = 0;
      }

    });
  }
  
  

  setRouteId(routeId: number): void {
    this.routeId = routeId;
    this.retrieveSecondStepData=null;
    this.activeIndex = 1;
  }

  reqOrderId(orderId: number): void {
    this.orderId = orderId;
  }


  getData(data: ShipmentData[]): void {    
    this.dataForMarker = data;
  }
  zoneForRouting(event: ReadyZoneData) {    
    this.readyZone = event;
  }

  activeStepChange(stepIndex: number): void {
    this.activeIndex = stepIndex;
    
  }
  dataForSecondStepper(event: ConfigurationData) {
    this.retrieveSecondStepData = event;
  }
  goToFirstStep(): void {
    this.activeIndex = 0;
  }
}
