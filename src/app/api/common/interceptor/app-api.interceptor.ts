import {Injectable} from "@angular/core";
import {HttpEvent, HttpHandler, HttpInterceptor,HttpRequest,HttpErrorResponse, HttpResponse} from '@angular/common/http';
import {Observable, of, throwError} from "rxjs";
import {catchError, tap} from 'rxjs/operators';
import { Router } from "@angular/router";
import { AuthService } from "../../auth/service/auth.service";
import { NavigationRouter } from "src/app/components/navigation-stack/navigation.router";
import { PageLocker } from "src/app/components/page-locker/page-locker.service";
 
@Injectable()
export class RelinkApiInterceptor implements HttpInterceptor {
    
  constructor(
    public router: Router, 
    private authService: AuthService, 
    private pageLocker: PageLocker,
    private navigationRouter: NavigationRouter) {
  }
 
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
 
    return next.handle(req)
    .pipe(
      tap((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          const headers = event.headers;
          if(headers.has('x-is-refresh-token') && headers.get('x-is-refresh-token') === 'true') {
            let refreshedIdToken = headers.get('x-refreshed-id-token') || ''; 
            this.authService.refreshToken(refreshedIdToken);
            this.pageLocker.unlock();
          }      
        }
      })
    )
    .pipe(
      catchError((error) => {
        let handled: boolean = false;
        if (error instanceof HttpErrorResponse) {
          if (error.error instanceof ErrorEvent) {
            console.error("Error Event");
          } 
          else {
            console.log(`error: ${JSON.stringify(error)} error status : ${error.status} ${error.statusText}`);
            switch (error.status) {
              case 401:
                this.authService.invalidateUnauthorizedUser()
                handled = true;
                break;
              case 403:
                this.navigationRouter.navigate(['forbidden'])
                handled = true;
                break;
            }
          }
        }
        else {
          console.error("Other Errors");
        }
 
        if (handled) {
          console.log('return back ');
          return of(error);
        } 
        else {
          this.pageLocker.unlock();
          return throwError(error);
        }
      })
    )
  }
}
 