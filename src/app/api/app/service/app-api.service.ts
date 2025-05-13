import { Injectable } from "@angular/core";
import { BehaviorSubject, Subject} from "rxjs";
import { HttpClient } from "@angular/common/http";
import { AppConfigService } from "src/app/page/service/app-config.service";
import { Config } from "../model/flux-gate.response";

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

    loadConfig() {
        return this.http.get<Config>(this.configApiUrl);
    }
    

    loadAvailableResolvers() {
        return this.http.get<string[]>(this.availableResolversApiUrl);
    }

    loadOperators() {
        return this.http.get<string[]>(this.operatorsApiUrl);
    }

    saveConfig(configJsonString: string) {
        let saved: Subject<any> = new Subject<any>();
        this.http.post<any>(this.configApiUrl, configJsonString).subscribe(response => {
          saved.next(response);
        });
        return saved.asObservable();
    }

    loadConfigModule() {
        return this.http.get<Config>(this.configModuleApiUrl);
    }


}
