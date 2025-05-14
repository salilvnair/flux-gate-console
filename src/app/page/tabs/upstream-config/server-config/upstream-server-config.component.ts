import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ServerConfig, ServerConfigData } from 'src/app/api/app/model/flux-gate.response';
import { AlertService } from 'src/app/components/alert/alert.service';
import { AppService } from 'src/app/page/service/app.service';




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
      this.dialogRef.close();
    }


    addServerConfig() {
      let currentData = this.dialogData.data.value
      currentData = currentData instanceof Array ? currentData : []
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