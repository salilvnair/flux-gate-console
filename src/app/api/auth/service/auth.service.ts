import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { MapUtil } from '../../../util/helper/map.util';
import { ApiConstant } from '../../../util/api-processor/constant/api.constant';
import { NavigationRouter } from 'src/app/components/navigation-stack/navigation.router';
import { UserTokenState, RoleInfo, UserRole } from '../model/user-token-state.model';
import { AppAuthService } from './app-auth.service';


@Injectable({
    providedIn: 'root'
})
export class AuthService {
  authorized = new BehaviorSubject<boolean>(false);
  private currentUserTokenStateSubject: BehaviorSubject<UserTokenState>;
  public currentUserTokenStatePublisher: Observable<UserTokenState>;
  constructor(
    private router: Router ,
    private navigationRouter: NavigationRouter,
    private appAuthService: AppAuthService
  ) {
    let currentUserTokenState = sessionStorage.getItem('currentUserTokenState')
    this.currentUserTokenStateSubject = new BehaviorSubject<UserTokenState>(JSON.parse(currentUserTokenState && currentUserTokenState!=='undefined' ? currentUserTokenState : '{}'));
    this.currentUserTokenStatePublisher = this.currentUserTokenStateSubject.asObservable();
  }

  public get currentUserTokenState(): UserTokenState {
    return this.currentUserTokenStateSubject.value;
  }

  public get currentUserRoles(): RoleInfo[] {
    return this.currentUserTokenState.userInfo?.roles
  }

  authenticated() {
    if(this.currentUserTokenStateSubject.value && Object.keys(this.currentUserTokenStateSubject.value).length > 0 && this.currentUserTokenStateSubject.value.validToken){
      return true;
    }
    return false;
  }


  invalidateUnauthorizedUser() {
    this.authorized.next(false);
    this.removeUserTokenState();
    this.currentUserTokenStateSubject.next(<UserTokenState>{});    
    this.redirect();
  }

  refreshToken(refreshedIdToken: string) {
    let currentUserTokenState = sessionStorage.getItem('currentUserTokenState') ?? '{}';
    let userTokenState: UserTokenState = JSON.parse(currentUserTokenState);
    if(userTokenState.idToken != refreshedIdToken) {
      userTokenState.idToken = refreshedIdToken;
      this.storeTokenState(userTokenState);
      this.publishTokenStateEvents(userTokenState);
    }
  }

  
  containsUserTokenState(){
    return sessionStorage.getItem('currentUserTokenState')==undefined ? false : true;
  }

  removeUserTokenState() {
    sessionStorage.removeItem("currentUserTokenState")
  }

  bootstrap() {
    if(this.authenticated()) {
        this.authorized.next(true);
        this.authorized.asObservable();
    }

    const url = new URL(window.location.href)
    console.log("containsOIDCQueryParams", this.containsOIDCQueryParams(url.searchParams))
    if(!this.containsUserTokenState() && !this.containsOIDCQueryParams(url.searchParams)) {
        console.log("redirecting....")
        this.redirect()
    }

    else if (!this.containsUserTokenState() && this.containsOIDCQueryParams(url.searchParams)) {
        console.log("authorizing....")
        let params = new HttpParams({ fromString: url.searchParams.toString() });
        this.authorize(params)
    }
    return this.authorized.asObservable();
  }

  containsOIDCQueryParams(urlSearchParams: URLSearchParams) {
    return urlSearchParams.has("state") && urlSearchParams.has("code")
  }

  authorize(params: any) {
    let requestParams = MapUtil
                        .init()
                        .add(ApiConstant.HTTP_PARAMS, params)
                        .extractMap();
    this.appAuthService.authorizeUser(requestParams).subscribe(apiResponse => {
      if(apiResponse.response) {
        this.processAuthenticationResponse(apiResponse.response);
      }
    })
  }

  processAuthenticationResponse(userTokenState: UserTokenState) {
    this.storeTokenState(userTokenState);
    this.publishTokenStateEvents(userTokenState);
    this.routeToPath(userTokenState);
  }

  storeTokenState(userTokenState: UserTokenState) {
    // store user details and jwt token in local storage to keep user logged in between page refreshes
    sessionStorage.setItem('currentUserTokenState', JSON.stringify(userTokenState));
    sessionStorage.setItem('userId', userTokenState?.userInfo?.username);
    this.storeUserRoles(userTokenState);
  }

  storeUserRoles(userTokenState: UserTokenState) {
    sessionStorage.setItem('userRoles', JSON.stringify(userTokenState?.userInfo?.roles));
  }

  hasUserRole(userRole: UserRole) {
    if(sessionStorage.getItem("userRoles")) {
      let userRoleString = sessionStorage.getItem("userRoles") ?? '{}';
      let userRoles: RoleInfo[] = JSON.parse(userRoleString);
      return userRoles.find(r => r.name === userRole)
    }
    return false;
  }

  userId() {
    return sessionStorage.getItem('userId');
  }

  loggedInUserId() {
    return sessionStorage.getItem('userId');
  }

  hasUserRoles(inputRoles: UserRole[]) {
    if(sessionStorage.getItem("userRoles")) {
      let userRoleString = sessionStorage.getItem("userRoles") ?? '{}';
      let userRoles: RoleInfo[] = JSON.parse(userRoleString);
      return inputRoles.every(role => userRoles.some(r => r.name == role))
    }
    return false;
  }

  publishTokenStateEvents(userTokenState: UserTokenState) {
    this.currentUserTokenStateSubject.next(userTokenState);
    this.authorized.next(userTokenState.validToken);
  }

  routeToPath(userTokenState: UserTokenState) {
    if(userTokenState.validToken) {
      let routeId = "/home"
      if(sessionStorage.getItem("REDIRECTED_FROM")) {
        routeId = sessionStorage.getItem("REDIRECTED_FROM") ?? "/home"
      }
      this.navigationRouter.navigate([routeId])
    }
    else {
      this.navigationRouter.navigate(['/forbidden'])
    }
  }

  redirect() {
    this.appAuthService.generateAuthRedirectURL({}).subscribe(apiResponse => {
      let redirectCount = sessionStorage.getItem("REDIRECT_COUNT")
      if(redirectCount) {
        let count = Number.parseInt(redirectCount);
        sessionStorage.setItem("REDIRECT_COUNT", (count+1)+"")
      }
      else {
        sessionStorage.setItem("REDIRECT_COUNT", "0")
      }
      sessionStorage.setItem("REDIRECTED_FROM", this.router.url)
      window.location.href = apiResponse.response ? apiResponse.response : "/home";
    })
  }

}