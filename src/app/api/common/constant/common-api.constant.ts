import { MapUtil } from "../../../util/helper/map.util";



export enum ApiName {
  APP_AUTH_REDIRECT = "APP_AUTH_REDIRECT",
  APP_AUTHORIZE = "APP_AUTHORIZE",
  GENERATE_FLEXWARE_MIGRATION_PAGES = "GENERATE_FLEXWARE_MIGRATION_PAGES",
}

export enum ApiSubContext {
  APP_AUTH_REDIRECT = "/relink-backend/auth/redirect",
  APP_AUTHORIZE = "/relink-backend/auth/authorize",
  GENERATE = "/relink-backend/app/api/v1/generate",
}


export class ApiNameSubContextMap {
    static nameSubContextMap() {
        let mapUtil = MapUtil.init();
        mapUtil.put(ApiName.APP_AUTH_REDIRECT, ApiSubContext.APP_AUTH_REDIRECT);
        mapUtil.put(ApiName.APP_AUTHORIZE, ApiSubContext.APP_AUTHORIZE);
        return mapUtil.extractMap();
    }
}
