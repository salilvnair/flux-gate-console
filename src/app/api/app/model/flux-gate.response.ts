import { BehaviorSubject } from "rxjs";

export interface Editable {
  edit?: boolean;
}

export interface Config {
  urlConfig: UrlConfig[];
  apiConfig: { [key: string]: ApiRow }
  upstreamConfig: UpstreamConfig[];
  defaultConfig: { [key: string]: string }
}

export interface UrlConfig extends Editable {
  id: string;
  subcontext: string;
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

export interface DataRow extends Editable {
  id: string;
  gate: boolean;
  name: string;
  rules: Rule[];
}

export interface Rule extends Editable {
  id: string;
  key: string;
  value: string;
  operator: string;
  group?: Rule[]
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

export class ConfigSaveRequest {
  config: any = '';
  userName: string  = '';
}