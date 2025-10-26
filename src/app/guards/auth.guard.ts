import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean | UrlTree {
    const loggedIn = this.authService.isLoggedIn();
    if (loggedIn) {
      return true;
    }
    // Redirection claire vers login
    return this.router.createUrlTree(['/login']);
  }
}
