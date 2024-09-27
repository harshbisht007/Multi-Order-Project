import {Injectable, signal, WritableSignal} from '@angular/core';
import {Zone} from "../../graphql/generated";
import {GraphqlService} from "./graphql.service";
import {gql} from "apollo-angular";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class ZoneService {
  private apiUrl = 'https://synco-demo.roadcast.net/api/v1/auth/zone?__limit=80&__active__bool=true&__geom__ne=null';

  authToken:any;
  zones: WritableSignal<Zone[]> = signal([] as Zone[]);
  constructor(private graphqlService: GraphqlService,private http: HttpClient,private authService:AuthService) {
    this.authToken=this.authService.getToken()
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
  }

  getZones(): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.authToken,
    });

    return this.http.get<any>(this.apiUrl, { headers });
  }
}
