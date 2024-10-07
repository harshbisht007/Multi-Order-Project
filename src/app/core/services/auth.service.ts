import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private loginUrl = 'https://synco-demo.roadcast.net/api/v1/auth/login';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    const payload = {
      email: email,
      password: password
    };

    return this.http.post<any>(this.loginUrl, payload, { headers }).pipe(
      tap((response) => {
        localStorage.setItem('synco_auth_token', response.token);
        localStorage.setItem('synco_refresh_token', response.refresh_token);
      })
    );
  }

  getToken(): string | null {
    return localStorage.getItem('synco_auth_token');
  }
}
