import { Injectable } from "@angular/core";
import { Subject} from "rxjs";
import { HttpClient } from "@angular/common/http";
import { AppConfigService } from "src/app/page/service/app-config.service";
import { Config, ConfigSaveRequest } from "../model/flux-gate.response";

@Injectable({
  'providedIn' : 'root'
})
export class AppApiService {

   private configApiUrl:string = '';
    private availableResolversApiUrl:string = '';
    private configModuleApiUrl:string = '';
    private operatorsApiUrl:string = '';

    private apiBaseUrl: string = '';

    constructor(private http: HttpClient, private appConfig: AppConfigService) {
        this.initEnvConfig()
    }

    initEnvConfig() {
        this.apiBaseUrl = this.appConfig.envConfig().apiBaseUrl;
        this.configApiUrl = `${this.apiBaseUrl}/config`;
        this.availableResolversApiUrl = `${this.apiBaseUrl}/availableResolvers`;
        this.configModuleApiUrl = `${this.apiBaseUrl}/configModule`;
        this.operatorsApiUrl = `${this.apiBaseUrl}/operators`;
    }

    public config:Config = <Config>{}

    public availableResolvers: string[] = []
    public operators: string[] = []


    extractApiBaseUrl() {
        return this.apiBaseUrl;
    }

    loadConfig() {
        return this.http.get<Config>(this.configApiUrl);
    }
    

    loadAvailableResolvers() {
        return this.http.get<string[]>(this.availableResolversApiUrl);
    }

    loadOperators() {
        return this.http.get<string[]>(this.operatorsApiUrl);
    }

    saveConfig(configSaveRequest: ConfigSaveRequest) {
        let saved: Subject<any> = new Subject<any>();
        this.http.post<any>(this.configApiUrl, configSaveRequest).subscribe(response => {
          saved.next(response);
        });
        return saved.asObservable();
    }

    loadConfigModule() {
        return this.http.get<Config>(this.configModuleApiUrl);
    }


}
