import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const userRole = localStorage.getItem('userRole');
    const requiredRole = route.data['role'];

    if (!userRole) {
      this.router.navigate(['/login']); // Redirect to login if not logged in
      return false;
    }

    // Check if the user has the required role
    if (requiredRole && userRole === requiredRole) {
      return true;
    }

    // If the role does not match, redirect to unauthorized page or login
    this.router.navigate(['/unauthorized']);
    return false;
  }
}
