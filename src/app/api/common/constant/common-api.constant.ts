import { MapUtil } from "../../../util/helper/map.util";



export enum ApiName {
  APP_AUTH_REDIRECT = "APP_AUTH_REDIRECT",
  APP_AUTHORIZE = "APP_AUTHORIZE" 
}

export enum ApiSubContext {
  APP_AUTH_REDIRECT = "/auth/redirect",
  APP_AUTHORIZE = "/auth/authorize"
}


export class ApiNameSubContextMap {
    static nameSubContextMap() {
        let mapUtil = MapUtil.init();
        mapUtil.put(ApiName.APP_AUTH_REDIRECT, ApiSubContext.APP_AUTH_REDIRECT);
        mapUtil.put(ApiName.APP_AUTHORIZE, ApiSubContext.APP_AUTHORIZE);
        return mapUtil.extractMap();
    }
}
