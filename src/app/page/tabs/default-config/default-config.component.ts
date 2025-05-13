import { Component, OnInit } from '@angular/core';
import { AppService } from '../../service/app.service';


@Component({
  selector: 'default-config',
  templateUrl: './default-config.component.html'
})
export class DefaultConfigComponent implements OnInit {
  serverConfigViewActivated = false
  constructor( private appService: AppService) {}

  defaultConfig: { [key: string]: string } = this.appService.config.defaultConfig      
  newDefaultConfig: { [key: string]: string } = {}  

  ngOnInit(): void {
    this.appService.serverConfigViewPublisher().subscribe(activated => {
      this.serverConfigViewActivated = activated
    });
    if(!this.defaultConfig) {
      this.addDefaultConfig("old_url", "");
    }
  }

  handleConfigChange(key:string, value:string) {
    this.newDefaultConfig[key] = value
  }

  addDefaultConfig(key:string, value:string) {
    this.defaultConfig = {}
    this.defaultConfig[key] = value
  }

  save() {
    if(this.newDefaultConfig && Object.keys(this.newDefaultConfig).length > 0) {
      this.appService.config.defaultConfig = {... this.newDefaultConfig}
      this.appService.saveConfig();
    }
  }

}
