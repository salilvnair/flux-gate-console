import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Config } from "./config.model";
import { MatSnackBar } from "@angular/material/snack-bar";
import { BehaviorSubject } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class AppService {

    private configApiUrl = 'http://localhost:8080/config';
    private availableResolversApiUrl = 'http://localhost:8080/availableResolvers';
    private configModuleApiUrl = 'http://localhost:8080/configModule';
    private operatorsApiUrl = 'http://localhost:8080/operators';

    private serverConfigView : BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)

    constructor(private http: HttpClient, private _snackBar: MatSnackBar) {}

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

    saveConfig() {
        const configJsonString = this.prepareConfig();
        return this.http.post<any>(this.configApiUrl, configJsonString).subscribe(response => {
            this.showMessage(response.message, "Ok")
        });
    }

    loadConfigModule() {
        return this.http.get<Config>(this.configModuleApiUrl);
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



}