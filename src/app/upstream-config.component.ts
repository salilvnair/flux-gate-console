import { Component, OnInit } from '@angular/core';
import {  MatDialog} from '@angular/material/dialog';
import { AppService } from './app.service';
import { BehaviorSubject } from 'rxjs';
import { AlertService } from './alert.service';
import { ServerConfig, ServerConfigData, UpstreamServerConfigComponent } from './upstream-server-config.component';
import { Editable } from './api-config.component';

export interface UpstreamConfig extends Editable {
  id: string;
  mappedKey: string;
  servers: ServerConfig[]
}

@Component({
    selector: 'upstream-config',
    templateUrl: 'upstream-config.component.html',
  })
  export class UpstreamConfigComponent implements OnInit {
    serverConfigViewActivated = false
    allIds: string [] = []
    newIds: string [] = []
  
    hasNewEntry = false;

    constructor(
      private appService: AppService, 
      private dialog: MatDialog,
      private alertService: AlertService) {}

    ngOnInit(): void {
      this.appService.serverConfigViewPublisher().subscribe(activated => {
        this.serverConfigViewActivated = activated
      })
      this.determineIfNewEntryInServerConfigIsThere();
    }
  
    upstreamConfig: BehaviorSubject<UpstreamConfig[]> = new BehaviorSubject<UpstreamConfig[]>(this.appService.config.upstreamConfig);
  
    addConfig() {
      let currentData = this.upstreamConfig.value
      if(!(currentData instanceof Array)) {
        currentData = []
      }
      let configData = {
        id: "",
        mappedKey: this.newIds[0],
        servers: [],
        edit: true
      }
      currentData.push(configData);
      this.upstreamConfig.next(currentData);
      this.appService.config.upstreamConfig = [...currentData]
      this.determineIfNewEntryInServerConfigIsThere();
    }
  
  
    deleteRow(dataRow: UpstreamConfig) {
      this.alertService.alert("Are you sure you want to delete this entry?").subscribe((result) => {
        if (result) {
          const currentData = this.upstreamConfig.value.filter(row => row !== dataRow);
          this.upstreamConfig.next(currentData);
          this.appService.config.upstreamConfig = [...currentData]
          this.determineIfNewEntryInServerConfigIsThere()
        }
      });
    }

    determineIfNewEntryInServerConfigIsThere() {
      let upstreamConfig = this.appService.config.upstreamConfig;
      this.newIds = []
      let allUpstreamMappedKeys = upstreamConfig.map(urlC => urlC.mappedKey)
      if(upstreamConfig && upstreamConfig instanceof Array) {
        const apiConfig = this.appService.config.apiConfig;
        this.allIds = []
        for(let key in apiConfig) {
          this.allIds.push(apiConfig[key].new_url)
        }
        this.allIds = Array.from(new Set(this.allIds));
        this.allIds.forEach(id => {
          if(id!=="" && allUpstreamMappedKeys.findIndex(u => u == id) < 0) {
            this.newIds.push(id)
          }
        })
        this.hasNewEntry = this.newIds.length > 0;
      }
    }

    openServerConfigDialog(data: ServerConfig[], upstreamConfig : UpstreamConfig): void {
      const serverConfigData = new BehaviorSubject<ServerConfig[]>(data);
      const dialogData: ServerConfigData = {
        title: upstreamConfig.mappedKey,
        data: serverConfigData,
      }
      const dialogRef = this.dialog.open(UpstreamServerConfigComponent, {
          data: dialogData
      });

      dialogRef.afterClosed().subscribe((updatedData: ServerConfig[] | undefined) => {
          if (updatedData) {
            upstreamConfig.servers = updatedData
          }
      });
    }

    save() {
      this.appService.saveConfig()
      this.determineIfNewEntryInServerConfigIsThere()
    }  
  
  }
  