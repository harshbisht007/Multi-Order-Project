import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Provider } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Injectable()
export class TokenInjectorInterceptor implements HttpInterceptor {
  private authToken: string | null = null;

  constructor(private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      if (params['auth_token']) {
        this.authToken = params['auth_token'];
      }
    });
  }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.url.includes('amazon') || req.url.includes('/api/v1/auth/zone') || req.url.includes('api/v1/auth/category')) {
      return next.handle(req);
    }


    const authReq = req.clone({
      headers: req.headers.set(
        'Authorization',
        this.authToken?this.authToken:'Bearer ' + localStorage.getItem('accessToken'),
      ),
    });

    return next.handle(authReq);
  }
}

export const TokenInjectorInterceptorProvider: Provider = {
  provide: HTTP_INTERCEPTORS,
  useClass: TokenInjectorInterceptor,
  multi: true
};
