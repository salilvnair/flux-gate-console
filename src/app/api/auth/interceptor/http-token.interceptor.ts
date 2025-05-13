import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../service/auth.service';



@Injectable()
export class RelinkHttpTokenInterceptor implements HttpInterceptor {
    constructor(
        private authenticationService: AuthService
    ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add authorization header with jwt token if available
        let currentUserTokenState = this.authenticationService.currentUserTokenState;
        if (currentUserTokenState && currentUserTokenState.idToken) {
            request = request.clone({
                setHeaders: {
                    "Authorization": `Bearer ${currentUserTokenState.idToken}`
                }
            });
        }

        return next.handle(request);
    }
}