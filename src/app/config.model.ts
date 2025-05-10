
import { ApiRow } from "./api-config.component";
import { UpstreamConfig } from "./upstream-config.component";
import { UrlConfig } from "./url-config.component";

export interface Config {
    urlConfig: UrlConfig[];
    defaultConfig: { [key: string]: string }
    apiConfig: { [key: string]: ApiRow }
    upstreamConfig: UpstreamConfig[];
}