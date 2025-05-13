import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { NavigationRouter } from 'src/app/components/navigation-stack/navigation.router';


@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(public navigationRouter: NavigationRouter) { }
  canActivate(route: ActivatedRouteSnapshot): boolean {
    return true;
  }
}