import {Injectable, signal, WritableSignal} from '@angular/core';
import {GraphqlService} from "./graphql.service";
import {Category} from "../../graphql/generated";
import {gql} from "apollo-angular";

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  categories: WritableSignal<Category[]> = signal([] as Category[]);
  constructor(private graphqlService: GraphqlService) {
    this.init().then()
  }

  async init() {
    await this.graphqlService.runQuery(gql`query {
      list_categories {
        id
        name

      }
    }`).then((res) => {
      console.log(res)
      this.categories.set(res.list_categories)
    })
  }
}
