import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { BehaviorSubject } from "rxjs";
import { Config, UrlConfig, ApiRow, ConfigSaveRequest } from "src/app/api/app/model/flux-gate.response";
import { AppApiService } from "src/app/api/app/service/app-api.service";
import { AuthService } from "src/app/api/auth/service/auth.service";

@Injectable({
    providedIn: 'root'
})
export class AppService {

    private serverConfigView : BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)


    constructor(
        private _snackBar: MatSnackBar, 
        private appApiService: AppApiService,
        private authService: AuthService
    ) {
    }

    public config:Config = <Config>{}
    public availableResolvers: string[] = []
    public operators: string[] = []

    loadConfig() {
        return this.appApiService.loadConfig();
    }
    

    loadAvailableResolvers() {
        return this.appApiService.loadAvailableResolvers();
    }

    loadOperators() {
        return this.appApiService.loadOperators();
    }

    saveConfig() {
        const configJsonString = this.prepareConfig();
        let configSaveRequest: ConfigSaveRequest = new ConfigSaveRequest();
        configSaveRequest.config = JSON.parse(configJsonString);
        configSaveRequest.userName = this.authService.userId() ?? '';
        this.appApiService.saveConfig(configSaveRequest).subscribe(response => {
            this.showMessage(response.message, "Ok")
        });
    }

    loadConfigModule() {
        return this.appApiService.loadConfigModule();
    }

    serverConfigViewPublisher() {
        return this.serverConfigView.asObservable()
    }

    publishServerConfigView(activate: boolean) {
        this.serverConfigView.next(activate)
    }


    prepareConfig() {
        const configJsonString = JSON.stringify(this.config, (key, value) => {
            if (key === 'edit') {
              return undefined;
            }
            if (key === 'key' && value === '') {
                return undefined;
            }
            if (key === 'value' && value === '') {
                return undefined;
            }
            return value;
        });
        return configJsonString;
    }



    showMessage(message: string, action: string) {
      this._snackBar.open(message, action, {
        duration: 5 * 1000,
      });
    }

    initConfig(config: Config) {
        let configLoaded = new BehaviorSubject<boolean>(false);
        this.config = config;
        this.loadAvailableResolvers().subscribe(resolvers => {
          this.availableResolvers = resolvers;
          this.loadOperators().subscribe(operators => {
            this.operators = operators;
            configLoaded.next(true);
          })
        })
        return configLoaded.asObservable();
    }


    findSubcontextByKey(key: string) {
        return this.config.urlConfig.find((config) => {
            return config.id === key;
        })
    }


    cascadeUrlConfigChildrenConfig(urlConfig: UrlConfig) {
        this.cascadeApiConfigChildrenConfig(this.config.apiConfig[urlConfig.id])
        if(this.config.apiConfig[urlConfig.id]) {
            delete this.config.apiConfig[urlConfig.id]
        }
    }

    cascadeApiConfigChildrenConfig(apiConfig: ApiRow) {
        if(this.config.upstreamConfig && this.config.upstreamConfig instanceof Array && this.config.upstreamConfig.length > 0) {
            const currentData = this.config.upstreamConfig.filter(r => r.upstream !== apiConfig.new_url);
            this.config.upstreamConfig = currentData && currentData.length > 0 ? [...currentData] : []
        }
    }



}