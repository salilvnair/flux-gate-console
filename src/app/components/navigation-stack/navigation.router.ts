import { Location } from "@angular/common";
import { Injectable } from "@angular/core";
import { ActivatedRoute, NavigationEnd, NavigationExtras, ParamMap, Router } from "@angular/router";
import { BehaviorSubject } from 'rxjs';

@Injectable({
    'providedIn': 'root'
})
export class NavigationRouter {

    private _stackedRoutes: RouteInfo[] = []

    private _traversedRouteIds: string[] = []

    private _data: any;

    constructor(
        private location: Location, 
        private router: Router,
        private activatedRoute: ActivatedRoute) {}

    private _stackedRoutesPublisher: BehaviorSubject<NavigationRoute> = new BehaviorSubject<NavigationRoute>({show: false, routes: [], currentRoute: <RouteInfo>{}});

    routePublisher() {
        return this._stackedRoutesPublisher.asObservable()
    }


    traversedRouteIds() {
        return this._traversedRouteIds
    }

    clearTraversedRoutes() {
        this._traversedRouteIds = []
    }

    show() {
        if(this._stackedRoutes && this._stackedRoutes.length > 0) {
            let currentRoute = this._stackedRoutes[this._stackedRoutes.length - 1]
            this._stackedRoutesPublisher.next({show: true, routes: this._stackedRoutes, currentRoute: currentRoute})
        }
    }
    

    hide() {
        this._stackedRoutesPublisher.next({ ...this._stackedRoutesPublisher.value, currentRoute: <RouteInfo>{}, show: false})
    }

    reset() {
        this._stackedRoutes = []
        this._stackedRoutesPublisher.next({show: false, routes: this._stackedRoutes, currentRoute: <RouteInfo>{}});
    }

    navigate(commands: any[], extras?: NavigationExtras): Promise<boolean> {
        this._traversedRouteIds.push(commands[0]);
        return this.router.navigate(commands, extras);
    }

    route(routeId: string, previousRouteLabel: string) {
        this._traversedRouteIds.push(routeId);
        let previousRouteId = this.router.url
        this._stackedRoutes.push({routeId, previousRouteId, previousRouteLabel})
        this.show()
        this.navigate([routeId]);
    }

    currentRouteUrl() {
        return this.router.url;
    }

    reload(data?: any) {
        this._data = data;
        this.navigate([this.router.url])
    }

    back() {
        this._stackedRoutes.pop()
        if(this._stackedRoutes.length === 0) {
            this.hide()
        }
        else {
            this.show()
        }
        this.location.back()
    }

    configureRedirectingOnSameRoute(router : Router) {
        router.routeReuseStrategy.shouldReuseRoute = () => false;
        let subscription = this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
            this.router.navigated = false;
            }
        });
        return subscription;
    }

    currentUrlWithQueryParams(): string {
        const urlWithoutQueryParams = this.router.url; // Get the URL path without query parameters
        const queryParams = this.activatedRoute.queryParamMap; // Get the query parameters as an observable
      
        let queryString = '';
        queryParams.subscribe((params: ParamMap) => {
          // Convert query parameters to a string
          queryString = Object.keys(params).map(key => `${key}=${params.get(key)}`).join('&');
        });
      
        // Combine the URL path and the query parameters
        return `${urlWithoutQueryParams}?${queryString}`;
    }

    data(): any {
        return this._data;
    }


}

export class NavigationRoute {
    show: boolean = false;
    routes: RouteInfo[] = [];
    currentRoute: RouteInfo = new RouteInfo;
}

export class RouteInfo {
    routeId!: string;
    previousRouteId!: string;
    previousRouteLabel!: string;
}