import { Injectable } from '@angular/core';
import { GraphqlService } from './graphql.service';
import { run_routing } from '../../graphql/mutation/runRouting';
import { updateRoute } from '../../graphql/mutation/runRouting';
import { getRouteDetails } from '../../graphql/queries/getRoute';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable } from '@apollo/client';
import { GeomOutlet, LatLngResponse } from '../../pages/main/load-data/load-data.component';
import { getOrderDetails } from '../../graphql/queries/getRoute';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class RunRoutingService {
  authToken: string|null;
  url:string=environment.get_outlet;

  constructor(private graphqlService: GraphqlService,private authService:AuthService,private http:HttpClient) {
    this.authToken=this.authService.getToken()

   }

  async getRouteTaskId(routeId: number) {
    return await this.graphqlService.runMutation(run_routing, { id: routeId });
  }

  async updateRoute(routeId: number,payload: any){
    return await this.graphqlService.runMutation(updateRoute, { id: routeId, change:payload})

  }

  async fetchRouteDetails(routeId:number){
    return await this.graphqlService.runQuery(getRouteDetails,{getRouteId:routeId})

  }

  async fetchOrderStatus(taskId:string){
    return await this.graphqlService.runQuery(getOrderDetails,{taskId:taskId});
  }

  async fetchOrderLatLng(outlets:GeomOutlet[]):Promise<{response : LatLngResponse[]}|undefined>{
    
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.authToken || '',
    });
   
    return this.http.post<{ response: LatLngResponse[]}| undefined>(this.url, outlets, { headers }).toPromise();
  }
}