import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GraphqlService } from './graphql.service';
import { CreateShipment } from '../../graphql/mutation/createShipment';
@Injectable({
  providedIn: 'root'
})
export class CreateShipmentService {

  constructor(private graphqlService: GraphqlService, private http: HttpClient) {
  }

  async createShipments(shipments:any){
    return await this.graphqlService.runMutation(CreateShipment,{data:shipments});
  }

}
