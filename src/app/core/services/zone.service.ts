import {Injectable, signal, WritableSignal} from '@angular/core';
import {Zone} from "../../graphql/generated";
import {GraphqlService} from "./graphql.service";
import {gql} from "apollo-angular";
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { zoneAPIResponse } from '../../graphql/interfaces/zoneData';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ZoneService {
  private apiUrl = environment.zone;  

  authToken:string|null;
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


  getZones(zoneId?: number): Observable<zoneAPIResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.authToken || '',
    });
  
    let params = new HttpParams()
      .set('__active__bool', 'true')
      .set('__geom__ne', 'null');
  
    if (zoneId) {
      params = params.set('__id__equal', zoneId);
    }
  
    return this.http.get<zoneAPIResponse>(this.apiUrl, { headers, params });
  }
  
  
}
