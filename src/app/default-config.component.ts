import { Component, OnInit } from '@angular/core';
import { AppService } from './app.service';


@Component({
  selector: 'default-config',
  templateUrl: './default-config.component.html'
})
export class DefaultConfigComponent implements OnInit {
  serverConfigViewActivated = false
  constructor(
        private appService: AppService) {}

  ngOnInit(): void {
    this.appService.serverConfigViewPublisher().subscribe(activated => {
      this.serverConfigViewActivated = activated
    })
  }

  defaultConfig: { [key: string]: string } = this.appService.config.defaultConfig


  save() {
    this.appService.saveConfig();
  }

}
