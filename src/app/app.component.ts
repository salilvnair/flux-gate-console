import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from './api/auth/service/auth.service';
import { NavigationRouter } from './components/navigation-stack/navigation.router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements  OnInit, OnDestroy {

  authorized = false
  forbiddenAccess = false
  subscription: Subscription;

  constructor(
    private router: Router, 
    private navigationRouter: NavigationRouter,
    private authService: AuthService
  ){
    this.subscription = this.navigationRouter.configureRedirectingOnSameRoute(this.router)
  }

  ngOnInit(): void {
    this.authService.bootstrap().subscribe(authorized => {
      this.authorized = authorized;
      if(!this.authorized && this.authService.currentUserTokenState && Object.keys(this.authService.currentUserTokenState).length > 0) {
        this.forbiddenAccess = !this.authService.currentUserTokenState?.validToken
      }
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
