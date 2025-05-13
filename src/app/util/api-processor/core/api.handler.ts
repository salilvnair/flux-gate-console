import {ApiDelegate} from "./api.delegate";
import {ApiRequest} from "../interface/api.request";
import {MapUtil} from "../../helper/map.util";

export abstract class ApiHandler {
    abstract delegate() : ApiDelegate;
    abstract prepareRequest(inputParamsMap: { [key:string]:any }, ...args: any[]): ApiRequest;
    abstract processResponse(response:any, inputParamsMap: { [key:string]:any }, ...args: any[]): void;
    emptyPayLoad():boolean { return false };
    extract(key:string, inputParamsMap: { [key:string]:any }): any {
        return MapUtil.init(inputParamsMap).get(key);
    }
    containsKey(key:string, inputParamsMap: { [key:string]:any }): boolean {
        return MapUtil.init(inputParamsMap).containsKey(key)
    }
}