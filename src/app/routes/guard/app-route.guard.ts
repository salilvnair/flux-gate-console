import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { NavigationRouter } from 'src/app/components/navigation-stack/navigation.router';
import { ArrayUtil } from 'src/app/util/helper/array.util';


@Injectable({
    providedIn: 'root'
})
export class RouteGuard implements CanActivate {
  constructor(public router: Router, private navigationRouter: NavigationRouter) { }
  canActivate(route: ActivatedRouteSnapshot): boolean {
    if(!ArrayUtil.contains(this.navigationRouter.traversedRouteIds(), route.data['routeId'])) {
      this.router.navigate([route.data['parentRouteId']]);
      return false;
    }
    return true;
  }
}