import {Injectable, signal, WritableSignal} from '@angular/core';
import {GraphqlService} from "./graphql.service";
import {Category} from "../../graphql/generated";
import {gql} from "apollo-angular";
import { AuthService } from './auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CategoryAPIresponse } from '../../graphql/interfaces/categoryAdditonal';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl=environment.category;
  authToken:string|null;

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
  getCategories(): Observable<CategoryAPIresponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.authToken || '',
    });

    return this.http.get<CategoryAPIresponse>(this.apiUrl, { headers });
  }
}
