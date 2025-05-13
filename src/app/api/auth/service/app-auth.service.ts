import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { ApiConstant } from "src/app/util/api-processor/constant/api.constant";
import { ApiFacade } from "src/app/util/api-processor/facade/api.facade";
import { MapUtil } from "src/app/util/helper/map.util";
import { AppAuthApiHandler } from "../../common/handler/app-auth-api.handler";
import { UserTokenState } from "../model/user-token-state.model";
import { ApiName } from "../../common/constant/common-api.constant";


@Injectable({
  'providedIn' : 'root'
})
export class AppAuthService {

  showloader:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(
    private apiFacade: ApiFacade,
    private ensAuthHandler: AppAuthApiHandler
    ) {
  }

  generateAuthRedirectURL(requestParams: { [key:string]:any }, ...args: any[]) {
    requestParams = MapUtil.init(requestParams).add(ApiConstant.API_NAME, ApiName.APP_AUTH_REDIRECT).extractMap();
    return this.apiFacade.initiate<string>(this.ensAuthHandler, requestParams, args);
  }

  authorizeUser(requestParams: { [key:string]:any }, ...args: any[]) {
    requestParams = MapUtil.init(requestParams).add(ApiConstant.API_NAME, ApiName.APP_AUTHORIZE).extractMap();
    return this.apiFacade.initiate<UserTokenState>(this.ensAuthHandler, requestParams, args);
  }
}
