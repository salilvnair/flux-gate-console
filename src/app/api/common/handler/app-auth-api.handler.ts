import { Injectable } from "@angular/core";
import { ApiDelegate } from "../../../util/api-processor/core/api.delegate";
import { ApiHandler } from "../../../util/api-processor/core/api.handler";
import { ApiRequest } from "../../../util/api-processor/interface/api.request";
import { AppAuthApiDelegate } from "../delegate/app-auth-api.delegate";

@Injectable({
  providedIn: 'root'
})
export class AppAuthApiHandler extends ApiHandler {

  constructor(
    private _delegate: AppAuthApiDelegate
  ){
    super();
  }

  override emptyPayLoad(): boolean {
    return true;
  }

  delegate(): ApiDelegate {
    return this._delegate;
  }
  prepareRequest(requestParams: { [key: string]: any; }, ...args: any): ApiRequest {
    return <ApiRequest>{};
  }

  processResponse(response: any, requestParams: { [key: string]: any; }, ...args: any[]): void {}

}
