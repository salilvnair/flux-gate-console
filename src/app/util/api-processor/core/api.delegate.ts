import {ApiRequest} from "../interface/api.request";
import {Observable, BehaviorSubject} from "rxjs";
import {ApiConfig} from "./api.config";


export interface ApiDelegate {
   apiLoading:BehaviorSubject<boolean>;
   apiConfig(inputParamsMap: { [p: string]: any }, ...args: any[]): ApiConfig;
   invoke(request:ApiRequest, inputParamsMap: { [key:string]:any }, ...args: any[]): Observable<any>;
}

