import { Injectable } from '@angular/core';
import { GraphqlService } from './graphql.service';
import { moveTouchPointToBatch } from '../../graphql/mutation/manageOrders';
import { placeOrder } from '../../graphql/mutation/manageOrders';
import { addInMissedBatch } from '../../graphql/mutation/manageOrders';
import { addNewMissedBatch } from '../../graphql/mutation/manageOrders';
import { updateBatchTouchPointOrder } from '../../graphql/mutation/manageOrders';
import { getOrderDetails } from '../../graphql/mutation/manageOrders';
@Injectable({
  providedIn: 'root'
})
export class ManageOrdersService {

  constructor(private graphqlService:GraphqlService) { }

  async moveTouchPointToBatch(batchId:any,touchPointId:any){
    return await this.graphqlService.runMutation(moveTouchPointToBatch, { toBatchId: batchId, touchPointId:touchPointId })
  }

  async placeOrder(orderId:any){
    return await this.graphqlService.runMutation(placeOrder,{orderId:orderId})
  }

  async addInMissedBatch(touchPointId:any){
    return await this.graphqlService.runMutation(addInMissedBatch, {touchPointId:touchPointId})

  }

  async addNewMissedBatch(touchPointId:any){
    return await this.graphqlService.runMutation(addNewMissedBatch,  {touchPointId:touchPointId})
  }

  async updateBatchTouchPointOrder(rows:any){
    return await this.graphqlService.runMutation(updateBatchTouchPointOrder,{rows})
  }

  async fetchOrderDetails(orderId:any){
    return await this.graphqlService.runQuery(getOrderDetails,{getOrderId:orderId})
  }
}
