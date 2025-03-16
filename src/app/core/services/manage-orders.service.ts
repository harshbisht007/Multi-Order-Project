import { Injectable } from '@angular/core';
import { GraphqlService } from './graphql.service';
import { moveTouchPointToBatch } from '../../graphql/mutation/manageOrders';
import { placeOrder } from '../../graphql/mutation/manageOrders';
import { addInMissedBatch } from '../../graphql/mutation/manageOrders';
import { addNewMissedBatch } from '../../graphql/mutation/manageOrders';
import { updateBatchTouchPointOrder } from '../../graphql/mutation/manageOrders';
import { reRunBatching } from '../../graphql/queries/getOrder';
import { getOrderDetails } from '../../graphql/queries/getOrder';
@Injectable({
  providedIn: 'root'
})
export class ManageOrdersService {

  constructor(private graphqlService: GraphqlService) { }

  async moveTouchPointToBatch(batchId: number, touchPointId: number) {
    return await this.graphqlService.runMutation(moveTouchPointToBatch, { toBatchId: batchId, touchPointId: touchPointId })
  }

  async placeOrder(orderId: number) {
    return await this.graphqlService.runMutation(placeOrder, { orderId: orderId })
  }

  async addInMissedBatch(touchPointId: number) {
    return await this.graphqlService.runMutation(addInMissedBatch, { touchPointId: touchPointId })

  }

  async addNewMissedBatch(touchPointId: number) {
    return await this.graphqlService.runMutation(addNewMissedBatch, { touchPointId: touchPointId })
  }

  async updateBatchTouchPointOrder(rows: {priority: number,id:number}[]) {
    return await this.graphqlService.runMutation(updateBatchTouchPointOrder, { rows })
  }

  async fetchOrderDetails(orderId: number) {
    return await this.graphqlService.runQuery(getOrderDetails, { getOrderId: orderId })
  }

  async reRunBatching(batchId: number | undefined) {
    return await this.graphqlService.runQuery(reRunBatching, { batchId: batchId })

  }
}
