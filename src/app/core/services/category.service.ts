import {Injectable, signal, WritableSignal} from '@angular/core';
import {GraphqlService} from "./graphql.service";
import {Category} from "../../graphql/generated";
import {gql} from "apollo-angular";
import { AuthService } from './auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl='https://synco-demo.roadcast.net/api/v1/auth/category?__active__bool=true&__weight__ne=null&__range_km__ne=null';
  authToken:any;

  categories: WritableSignal<Category[]> = signal([] as Category[]);
  constructor(private http: HttpClient,private graphqlService: GraphqlService,private authService:AuthService) {
    this.authToken=this.authService.getToken()

    this.init().then()
  }

  async init() {
    const res=await this.graphqlService.runQuery(gql`query {
      list_categories {
        id
        name

      }
    }`);
    this.categories.set(res.list_categories)

  }
  getCategories(): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.authToken,
    });

    return this.http.get<any>(this.apiUrl, { headers });
  }
}
