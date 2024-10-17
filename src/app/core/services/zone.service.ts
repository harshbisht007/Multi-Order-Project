import {Injectable, signal, WritableSignal} from '@angular/core';
import {Zone} from "../../graphql/generated";
import {GraphqlService} from "./graphql.service";
import {gql} from "apollo-angular";
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class ZoneService {
  private apiUrl = 'https://synco-demo.roadcast.net/api/v1/auth/zone';  

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


  getZones(zoneId?: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.authToken,
    });
  
    let params = new HttpParams()
      .set('__active__bool', 'true')
      .set('__geom__ne', 'null');
  
    console.log(zoneId,'122')
    if (zoneId) {
      params = params.set('__id__equal', zoneId);
    }
  
    return this.http.get<any>(this.apiUrl, { headers, params });
  }
  
  
}
