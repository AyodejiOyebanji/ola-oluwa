import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { UserServiceService } from '../services/user-service.service';

@Injectable({
  providedIn: 'root',
})
export class NoAuthGuard implements CanActivate {
  constructor(private userService: UserServiceService, private router: Router) {}

  canActivate(): boolean | UrlTree {
    if (!this.userService.IsLoggedIn()) {
      return true;
    }
    // Already logged in — redirect to dashboard
    return this.router.createUrlTree(['/dashboard']);
  }
}
