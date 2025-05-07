import { Component, OnInit } from '@angular/core';
import { AppService } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(private appService: AppService){}
  configLoaded = false;
  activeTab = 1

  ngOnInit(): void {
    this.loadConfig()
  }

  handleTabSelection(tab: number) {
   this.activeTab = tab;
  }

  handleConfigModule(event:any) {
    this.configLoaded = false
    this.appService.publishServerConfigView(event.checked)
    if(event.checked) {
      this.loadConfigModule()
    }
    else {
      this.loadConfig()
    }
  }

  
  loadConfigModule() {
    this.appService.loadConfigModule().subscribe(config => {
      this.appService.config = config;
      this.configLoaded = true;
    })
  }

  loadConfig() {
    this.appService.loadConfig().subscribe(config => {
      this.appService.initConfig(config).subscribe((config) => {
        this.configLoaded = true;
      })
    });
  }
}
