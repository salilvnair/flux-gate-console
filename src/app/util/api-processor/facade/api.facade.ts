import {ApiHandler} from "../core/api.handler";
import {ApiRequest} from "../interface/api.request";
import {ApiDelegate} from "../core/api.delegate";
import {ApiResponse} from "../interface/api.response";
import {Injectable} from "@angular/core";
import {Observable, of, Subject} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class ApiFacade {
    initiate<T>(handler:ApiHandler, inputParamsMap: { [key:string]:any }, ...args: any[]): Observable<ApiResponse<T>> {
        let responseSubject: Subject<ApiResponse<T>> = new Subject<ApiResponse<T>>()
        if(handler == null) {
            return of(<ApiResponse<T>>{ hasError:true, error: "Handler is null", request: null, inputParamsMap, args });
        }
        let request: ApiRequest = <ApiRequest>{};
        if(!handler.emptyPayLoad()) {
            request = handler.prepareRequest(inputParamsMap, args);
        }
        let delegate: ApiDelegate = handler.delegate();
        if(delegate == null) {
            return of(<ApiResponse<T>>{ hasError:true, error: "Delegate is null", request, inputParamsMap, args });
        }
        

        delegate.invoke(request, inputParamsMap, args).subscribe( (response: T) => {
            handler.processResponse(response, inputParamsMap, args);
            let apiResponse = <ApiResponse<T>>{ hasError:false, response, request, inputParamsMap, args }
            responseSubject.next(apiResponse);
            responseSubject.complete();
        }, error => {
            let apiErrorResponse = <ApiResponse<T>>{ hasError:true, error, request, inputParamsMap, args }
            responseSubject.next(apiErrorResponse);
            responseSubject.complete();
        });
        return responseSubject.asObservable();
    }
}

