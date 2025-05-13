import { Component, Inject, OnInit } from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { BehaviorSubject } from 'rxjs';
import { DataRow, ConfigDialogData, Rule, RuleDialogData, ApiRow } from 'src/app/api/app/model/flux-gate.response';
import { AlertService } from 'src/app/components/alert/alert.service';
import { AppService } from 'src/app/page/service/app.service';
import { RuleComponentConfig } from './rule-config/rule.component';



@Component({
    selector: 'config-component',
    templateUrl: 'config.component.html',
  })
  export class ConfigComponentDialog implements OnInit {
    initialData: DataRow[] = []
    serverConfigViewActivated = false
    constructor(
      public dialogRef: MatDialogRef<ConfigComponentDialog>,
      private appService: AppService,
      @Inject(MAT_DIALOG_DATA) public dialogData: ConfigDialogData,
      private dialog: MatDialog, 
      private alertService: AlertService
    ) {
        this.initialData = this.dialogData.data && this.dialogData.data instanceof Array ? [...this.dialogData.data.value] : []
        this.dialogData.data.subscribe(rules => this.dataSource.data = rules ?? []);
    }

    ngOnInit(): void {
        this.appService.serverConfigViewPublisher().subscribe(activated => {
            this.serverConfigViewActivated = activated
        })
    }

    public dataSource = new MatTableDataSource<DataRow>();
  
    onCancelClick(): void {
        this.dialogRef.close(this.initialData);
    }

    toggleRuleExpand(dataRow: DataRow) {
        this.openRuleDialog(dataRow.rules, dataRow)
    }

    openRuleDialog(data: Rule[], dataRow: DataRow): void {
        const rules = new BehaviorSubject<Rule[]>(data);
        const dialogData: RuleDialogData = {
            title: 'Config(' + dataRow.id + ") > "+this.dialogData.title,
            data: rules,
            groupedRules: false
        }
        const dialogRef = this.dialog.open(RuleComponentConfig, {
            data: dialogData
        });

        dialogRef.afterClosed().subscribe((updatedData: Rule[] | undefined) => {
            if (updatedData) {
                let apiConfig: { [key: string]: ApiRow } = this.appService.config.apiConfig
                let dataRows = apiConfig[this.dialogData.configId].data
                if(dataRows && dataRows.length > 0) {
                    for (let index = 0; index < dataRows.length; index++) {
                        const element = dataRows[index];
                        if(element.id === dataRow.id) {
                            element.rules = updatedData
                        }
                    }
                }
            }
        });
    }

    addRow() {
        let currentData = this.dialogData.data.value
        currentData = currentData instanceof Array ? currentData : []
        currentData.push({ id: currentData?.length ? (currentData?.length + 1 ) +"": "1", gate: false, rules: [], edit: true });
        this.dialogData.data.next(currentData);
        this.updateTableData(); 
    }
    
    deleteRow(dataRow: DataRow) {
        this.alertService.alert("Are you sure you want to delete this entry?").subscribe((result) => {
            if (result) {
                const currentData = this.dialogData.data.value.filter(row => row !== dataRow);
                this.dialogData.data.next(currentData);
                this.updateTableData(); 
            }
        });
    }

    save() {
        this.dialogRef.close(this.dialogData.data.value);
    }

    private updateTableData() {
        this.dataSource.data = this.dialogData.data.value; // Update MatTableDataSource
    }
  }