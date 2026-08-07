import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { UserServiceService } from '../services/user-service.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private userService: UserServiceService, private router: Router) {}

  canActivate(): boolean | UrlTree {
    if (this.userService.IsLoggedIn()) {
      return true;
    }
    // Not logged in — redirect to login and block navigation
    return this.router.createUrlTree(['/']);
  }
}
