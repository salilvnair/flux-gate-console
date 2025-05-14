import { Component, OnInit } from '@angular/core';
import { AppService } from '../service/app.service';
import { AuthService } from 'src/app/api/auth/service/auth.service';
@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  constructor(
    private appService: AppService,
    private authService: AuthService
  ){}
  configLoaded = false;
  activeTab = 1
  userName = ''

  ngOnInit(): void {
    this.loadConfig()
    this.extractUserName()
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

  extractUserName() {
    this.userName = this.authService.userId() ?? ''
  }
}
