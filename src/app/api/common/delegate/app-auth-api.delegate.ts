import { AppApiService } from 'src/app/api/app/service/app-api.service';
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { ApiConstant } from "../../../util/api-processor/constant/api.constant";
import { ApiConfig } from "../../../util/api-processor/core/api.config";
import { ApiDelegate } from "../../../util/api-processor/core/api.delegate";
import { ApiRequest } from "../../../util/api-processor/interface/api.request";
import { MapUtil } from "../../../util/helper/map.util";
import { ApiName, ApiNameSubContextMap } from "../constant/common-api.constant";

@Injectable({
  providedIn : 'root'
})
export class AppAuthApiDelegate implements ApiDelegate {
  apiLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(
    private http: HttpClient,
    private appApiService: AppApiService
    ) {}
  invoke(request: ApiRequest, requestParams: { [p: string]: any }, ...args: any[]): Observable<any> {
    var headers: any = { 'Content-Type': 'application/json'};
    let config : any = this.apiConfig(requestParams, args);
    let apiConfigHeaders = config.headers;
    if(apiConfigHeaders) {
        for (const headersKey in apiConfigHeaders) {
            headers[headersKey] = apiConfigHeaders[headersKey];
        }
    }
    let apiUrl= this.appApiService.extractApiBaseUrl() + config.subContext;
    let apiName = MapUtil.init(requestParams).get(ApiConstant.API_NAME);
    if(apiName === ApiName.APP_AUTH_REDIRECT) {
        return this.http.get(apiUrl, { responseType: 'text' });

    }
    else {
        let params = MapUtil.init(requestParams).get(ApiConstant.HTTP_PARAMS);
        return this.http.get(apiUrl, { params: params });
    }
  }

  apiConfig(requestParams: { [p: string]: any }, ...args: any[]) {
    let apiName = MapUtil.init(requestParams).get(ApiConstant.API_NAME);
    let apiConfig : ApiConfig = {}
    let nameSubContextMapUtil = MapUtil.init(ApiNameSubContextMap.nameSubContextMap());
    if(nameSubContextMapUtil.containsKey(apiName)) {
        apiConfig.subContext = nameSubContextMapUtil.get(apiName);
    }
    return apiConfig;
  }
}
