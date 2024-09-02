import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Provider } from '@angular/core';

@Injectable()
export class TokenInjectorInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.url.includes('amazon')) {
      return next.handle(req);
    }

    const authReq = req.clone({
      headers: req.headers.set(
        'Authorization',
        'Bearer ' + localStorage.getItem('accessToken'),
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
