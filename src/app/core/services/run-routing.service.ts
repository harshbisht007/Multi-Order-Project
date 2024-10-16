import { Injectable } from '@angular/core';
import { GraphqlService } from './graphql.service';
import { run_routing } from '../../graphql/mutation/runRouting';
import { updateRoute } from '../../graphql/mutation/runRouting';
import { getRouteDetails } from '../../graphql/queries/getRoute';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable } from '@apollo/client';
@Injectable({
  providedIn: 'root'
})
export class RunRoutingService {
  authToken: any;
  url:any='https://synco-demo.roadcast.net/api/v1/auth/get_outlet_geom';

  constructor(private graphqlService: GraphqlService,private authService:AuthService,private http:HttpClient) {
    this.authToken=this.authService.getToken()

   }

  async runRouting(routeId: number) {
    return await this.graphqlService.runMutation(run_routing, { id: routeId });
  }

  async updateRoute(routeId: any,payload: any){
    return await this.graphqlService.runMutation(updateRoute, { id: routeId, change:payload})

  }

  async fetchRouteDetails(routeId:any){
    return await this.graphqlService.runQuery(getRouteDetails,{getRouteId:routeId})

  }

  async fetchOrderLatLng(outlets:any):Promise<any>{
    console.log(outlets,'122')
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.authToken,
    });
   
    return this.http.post<any>(this.url, outlets, { headers }).toPromise();
  }
}