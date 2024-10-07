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
import { filter } from 'rxjs/operators';
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
      .pipe(filter((event: any) => event instanceof NavigationEnd)) // Filter for NavigationEnd events
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

      console.log('Current activeIndex:', this.activeIndex);
    });
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
