import {Injectable, signal, WritableSignal} from '@angular/core';
import {Zone} from "../../graphql/generated";
import {GraphqlService} from "./graphql.service";
import {gql} from "apollo-angular";

@Injectable({
  providedIn: 'root'
})
export class ZoneService {

  zones: WritableSignal<Zone[]> = signal([] as Zone[]);
  constructor(private graphqlService: GraphqlService) {
    this.init().then()
  }

  async init() {
    const res=await this.graphqlService.runQuery(gql`query {
      list_zones {
        id
        name

      }
    }`)
     this.zones.set(res.list_zones)
    console.log(this.zones(),'122')
  }
}
