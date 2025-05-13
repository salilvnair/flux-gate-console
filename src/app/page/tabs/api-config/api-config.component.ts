import { Component, Inject, OnInit } from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { ConfigComponentDialog } from './gate-config/config.component';
import { BehaviorSubject } from 'rxjs';
import { AlertService } from '../../../components/alert/alert.service';
import { AppService } from '../../service/app.service';
import { ApiRow, DataRow, ConfigDialogData } from 'src/app/api/app/model/flux-gate.response';



@Component({
  selector: 'api-config',
  templateUrl: './api-config.component.html',
  styleUrls: ['./api-config.component.css']
})
export class ApiConfigComponent implements OnInit {
  serverConfigViewActivated = false
  availableResolvers: string[] = this.appService.availableResolvers
  constructor(private dialog: MatDialog, 
        private appService: AppService, 
        private alertService: AlertService) {}

  ngOnInit(): void {
    this.appService.serverConfigViewPublisher().subscribe(activated => {
      this.serverConfigViewActivated = activated
    })
    this.determineIfNewEntryInUrlConfigIsThere();
  }

  apiConfig: { [key: string]: ApiRow } = this.appService.config.apiConfig

  expandedRow: string | null = null;
  ruleExpandedRow: DataRow | null  = null;

  allIds: string [] = []
  newIds: string [] = []

  hasNewEntry = false;

  toggleExpand(rowKey: string) {
    console.log(rowKey)
    this.expandedRow = this.expandedRow === rowKey ? null : rowKey;
    this.openDataDialog(this.apiConfig[rowKey].data, rowKey)
  }

  openDataDialog(data: DataRow[], rowKey:string): void {
    let urlConfigRow = this.appService.config.urlConfig.find(c => c.id === rowKey)
    const dataRows = new BehaviorSubject<DataRow[]>(data);
    const dialogData: ConfigDialogData = {
      title: 'Api Config: ' +urlConfigRow?.subcontext ? rowKey + ": " +urlConfigRow?.subcontext : rowKey,  
      configId: rowKey,
      data: dataRows
    }
    const dialogRef = this.dialog.open(ConfigComponentDialog, {data : dialogData});

    dialogRef.afterClosed().subscribe((updatedData: DataRow[] | undefined) => {
      if (updatedData) {
        const rowKey = Object.keys(this.apiConfig).find(key => this.apiConfig[key].data === data);
        if (rowKey) {
            this.apiConfig[rowKey].data = updatedData;
        }
      }
    });
  }

  deleteApiConfig(rowKey: string ) {
    this.alertService.alert("Are you sure you want to delete this entry?").subscribe((result) => {
      if (result) {
        this.appService.cascadeApiConfigChildrenConfig(this.apiConfig[rowKey])
        delete this.apiConfig[rowKey];
        this.determineIfNewEntryInUrlConfigIsThere();
      }
    });
  }

  addApiConfig() {
    this.apiConfig = this.appService.config.apiConfig || {};
    this.apiConfig[this.newIds[0]] = {
      new_url: '',
      old_url: '',
      active: true,
      old_url_upstream: false,
      new_url_upstream: false,
      data: [
          
      ],
      resolver_module: this.availableResolvers[0],
      edit: true
    }
    this.appService.config.apiConfig = this.apiConfig;
    this.determineIfNewEntryInUrlConfigIsThere();
  }

  save() {
    this.appService.saveConfig();
    this.determineIfNewEntryInUrlConfigIsThere();
  }

  determineIfNewEntryInUrlConfigIsThere() {
    this.newIds = []
    const urlConfig = this.appService.config.urlConfig;
    if(urlConfig && urlConfig instanceof Array) {
      this.allIds = this.appService.config.urlConfig.map(urlC => urlC.id)
      this.allIds.forEach(id => {
        if(id!=="" && !this.apiConfig?.[id]) {
          this.newIds.push(id)
        }
      })
      this.hasNewEntry = this.newIds.length > 0;
    }
  }

  fetchSubcontextTooltip(id: string) {
    const urlConfig = this.appService.findSubcontextByKey(id);
    if (urlConfig) {
      return urlConfig.subcontext;
    }
    return '';
  }

}
