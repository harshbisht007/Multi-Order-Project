import { Injectable } from '@angular/core';
import { GraphQLError } from 'graphql/index';
import { Apollo } from 'apollo-angular';
import { catchError, firstValueFrom, map } from 'rxjs';
import { ToastService } from './toast.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class GraphqlService {
  constructor(
    private apollo: Apollo,
    private messageService: ToastService,
    private router: Router,
  ) {}

  async runQuery(
    query: any,
    variables?: any,
  ): Promise<any | GraphQLError> {
    return await firstValueFrom(
      this.apollo
        .query({
          query,
          variables,
          errorPolicy: 'all',
        })
        .pipe(
          map((res) => {
            if (res.errors) {
              if (res.errors[0].message === 'Signature has expired') {
                this.router.navigate(['/login']);
              }
              if (res.errors.length > 0 && res.errors[0].extensions) {
                const message: unknown = res.errors[0].extensions['message'];
                this.messageService.show({
                  message: message as string,
                  delay: 5000,
                  header: 'Error',
                });
                throw new GraphQLError(res.errors[0].message, {
                  extensions: res.errors[0].extensions,
                });
              }
            }
            return res.data;
          }),
          catchError((err) => {
            throw new GraphQLError(err.message, {
              extensions: err.extensions,
            });
          }),
        ),
    );
  }

  async runMutation(
    mutation: any,
    variables?: any,
  ): Promise<any | GraphQLError> {
    return await firstValueFrom(
      this.apollo
        .mutate({
          mutation: mutation,
          variables,
          errorPolicy: 'all',
        })
        .pipe(
          map((res) => {
            if (
              res.errors &&
              res.errors.length > 0 &&
              res.errors[0].extensions
            ) {
              const message: unknown = res.errors[0]['message'];
              this.messageService.show({
                message: (message as string).substring(0, 255),
                delay: 5000,
                header: 'Error',
              });
              throw new GraphQLError(res.errors[0].message, {
                extensions: res.errors[0].extensions,
              });
            }
            return res.data;
          }),
        ),
    );
  }
}
