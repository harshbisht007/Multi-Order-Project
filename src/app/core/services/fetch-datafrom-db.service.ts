import { Injectable } from '@angular/core';
import { GraphqlService } from './graphql.service';
import { fetchDataFromDB } from '../../graphql/queries/fetchDataDB';
@Injectable({
  providedIn: 'root'
})
export class FetchDatafromDBService {

  constructor(private graphqlService:GraphqlService) {
   }

  async fetchDataFromDB(){
    return await this.graphqlService.runQuery(fetchDataFromDB);
  }
}
