import { Component, OnInit } from '@angular/core';
import { AppService } from './app.service';
import { BehaviorSubject } from 'rxjs';
import { Editable } from './api-config.component';
import { AlertService } from './alert.service';


export interface UrlConfig extends Editable {
  id: string;
  subcontext: string;
}

@Component({
  selector: 'url-config',
  templateUrl: './url-config.component.html'
})
export class UrlConfigComponent implements OnInit {
  serverConfigViewActivated = false
  constructor(private appService: AppService, private alertService: AlertService) {}
  ngOnInit(): void {
    this.appService.serverConfigViewPublisher().subscribe(activated => {
      this.serverConfigViewActivated = activated
    })
  }

  urlConfig: BehaviorSubject<UrlConfig[]> = new BehaviorSubject<UrlConfig[]>(this.appService.config.urlConfig);

  addRow() {
    let currentData = this.urlConfig.value
    if(!(currentData instanceof Array)) {
      currentData = []
    }
    currentData.push({ id: "", subcontext: "", edit: true });
    this.urlConfig.next(currentData);
    this.appService.config.urlConfig = [...currentData]
  }

  deleteRow(dataRow: UrlConfig) {
    this.alertService.alert("Are you sure you want to delete this entry?").subscribe((result) => {
      if (result) {
        const currentData = this.urlConfig.value.filter(row => row !== dataRow);
        this.urlConfig.next(currentData);
        this.appService.config.urlConfig = [...currentData]
      }
    });
  }

  save() {
    this.appService.saveConfig()
  }  

}
