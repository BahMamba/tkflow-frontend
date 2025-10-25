import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

interface LoginResponse {
  access: string;
  refresh: string;
  user: { id: string; email: string };
}

interface RegisterResponse {
  message: string;
  user_id: string;
}

interface RefreshResponse {
  access: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8000/api/auth/';

  constructor(private http: HttpClient) {}

  register(email: string, password: string): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.apiUrl}register/`, { email, password });
  }

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}login/`, { email, password }).pipe(
      tap((response) => {
        localStorage.setItem('access_token', response.access);
        localStorage.setItem('refresh_token', response.refresh);
        localStorage.setItem('user', JSON.stringify(response.user));
      })
    );
  }

  refreshToken(): Observable<RefreshResponse> {
    return this.http.post<RefreshResponse>(`${this.apiUrl}refresh/`, { refresh: localStorage.getItem('refresh_token') }).pipe(
      tap((response) => localStorage.setItem('access_token', response.access))
    );
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('access_token');
  }

  logout(): void {
    localStorage.clear();
  }
}