import { Injectable } from '@angular/core';
import { GraphqlService } from './graphql.service';
import { run_routing } from '../../graphql/mutation/runRouting';
import { updateRoute } from '../../graphql/mutation/runRouting';
import { getRouteDetails } from '../../graphql/mutation/runRouting';
@Injectable({
  providedIn: 'root'
})
export class RunRoutingService {

  constructor(private graphqlService: GraphqlService) { }

  async runRouting(routeId: number) {
    return await this.graphqlService.runMutation(run_routing, { id: routeId });
  }

  async updateRoute(routeId: any,payload: any){
    return await this.graphqlService.runMutation(updateRoute, { id: routeId, change:payload})

  }

  async fetchRouteDetails(routeId:any){
    return await this.graphqlService.runQuery(getRouteDetails,{getRouteId:routeId})

  }
}
