
import { ApiRow } from "./api-config.component";
import { UrlConfig } from "./url-config.component";

export interface Config {
    urlConfig: UrlConfig[];
    defaultConfig: { [key: string]: string }
    apiConfig: { [key: string]: ApiRow }
}