import { BehaviorSubject } from "rxjs";

export interface Editable {
  edit?: boolean;
}

export interface Rule extends Editable {
  id: string;
  key: string;
  value: string;
  operator: string;
  group?: Rule[]
}

export interface DataRow extends Editable {
  id: string;
  gate: boolean;
  rules: Rule[];
}

export interface ApiRow extends Editable {
  old_url: string;
  new_url: string;
  old_url_upstream: boolean;
  new_url_upstream: boolean;
  active: boolean;
  data: DataRow[];
  resolver_module: string;
}

export interface ConfigDialogData {
    configId: string;
    title: string;
    data: BehaviorSubject<DataRow[]>;
}

export interface RuleDialogData {
    title: string;
    data: BehaviorSubject<Rule[]>;
    groupedRules: boolean;
}

export interface UpstreamConfig extends Editable {
  id: string;
  upstream: string;
  servers: ServerConfig[]
}

export interface ServerConfigData {
  title: string;
  data: BehaviorSubject<ServerConfig[]>;  
}

export interface ServerConfig  extends Editable {
  id: string;
  address: string;
}
export interface UrlConfig extends Editable {
  id: string;
  subcontext: string;
}

export interface Config {
    urlConfig: UrlConfig[];
    defaultConfig: { [key: string]: string }
    apiConfig: { [key: string]: ApiRow }
    upstreamConfig: UpstreamConfig[];
}
