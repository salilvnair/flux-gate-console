import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import { AppService } from './app.service';
import { BehaviorSubject } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { AlertService } from './alert.service';
import { Editable } from './api-config.component';

export interface ServerConfigData {
  title: string;
  data: BehaviorSubject<ServerConfig[]>;  
}

export interface ServerConfig  extends Editable {
  id: string;
  address: string;
}

@Component({
    selector: 'upstream-server-config',
    templateUrl: 'upstream-server-config.component.html',
  })
  export class UpstreamServerConfigComponent implements OnInit {
    serverConfigViewActivated = false
    initialData: ServerConfig[] = []
    constructor(
      public dialogRef: MatDialogRef<UpstreamServerConfigComponent>,
      private appService: AppService,
      @Inject(MAT_DIALOG_DATA) public dialogData:  ServerConfigData,
      private dialog: MatDialog,
      private alertService: AlertService
    ) {
      this.initialData = this.dialogData.data && this.dialogData.data instanceof Array ? [...this.dialogData.data.value] : []
      this.dialogData.data.subscribe(configs => this.dataSource.data = configs ?? []);
    }


    ngOnInit(): void {
      this.appService.serverConfigViewPublisher().subscribe(activated => {
        this.serverConfigViewActivated = activated
      })
    }

    public dataSource = new MatTableDataSource<ServerConfig>();
  

    onCancelClick(): void {
      this.dialogRef.close(this.initialData);
    }


    addServerConfig() {
      const currentData = this.dialogData.data.value
      currentData.push({ id: currentData?.length ? (currentData?.length + 1 ) +"": "1", address: '', edit: true });
      this.dialogData.data.next(currentData);
    }

    deleteServerConfig(serverConfig: ServerConfig) {
      this.alertService.alert("Are you sure you want to delete this rule?").subscribe((result) => {
        if (result) {
          const currentData = this.dialogData.data.value.filter(r => r !== serverConfig);
          this.dialogData.data.next(currentData);
        }
      });
    }

    save() {
      this.dialogRef.close(this.dialogData.data.value);
    }
  }