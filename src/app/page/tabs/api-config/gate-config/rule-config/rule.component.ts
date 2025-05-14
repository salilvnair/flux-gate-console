import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { BehaviorSubject } from 'rxjs';
import { Rule } from 'src/app/api/app/model/flux-gate.response';
import { AlertService } from 'src/app/components/alert/alert.service';
import { RuleDialogData } from 'src/app/page/model/flux-gate-dialog.data';
import { AppService } from 'src/app/page/service/app.service';




@Component({
    selector: 'rule-config-component',
    templateUrl: 'rule.component.html',
  })
  export class RuleComponentConfig implements OnInit {
    serverConfigViewActivated = false
    initialData: Rule[] = []
    operators: string[] = this.appService.operators;
    constructor(
      public dialogRef: MatDialogRef<RuleComponentConfig>,
      private appService: AppService,
      @Inject(MAT_DIALOG_DATA) public dialogData:  RuleDialogData,
      private dialog: MatDialog,
      private alertService: AlertService
    ) {
      this.initialData = this.initialData = this.dialogData.data && this.dialogData.data instanceof Array ? [...this.dialogData.data.value] : []
      this.dialogData.data.subscribe(rules => this.dataSource.data = rules ?? []);
    }


    ngOnInit(): void {
      this.appService.serverConfigViewPublisher().subscribe(activated => {
        this.serverConfigViewActivated = activated
      })
    }

    public dataSource = new MatTableDataSource<Rule>();
  
    onCancelClick(): void {
      this.dialogRef.close();
    }


    addRule() {
      const currentData = this.dialogData.data.value
      currentData.push({ id: currentData?.length ? (currentData?.length + 1 ) +"": "1", key: '', value: '', operator: 'AND', edit: true });
      this.dialogData.data.next(currentData);
    }

    toggleGroupExpand(rule : Rule, groupedRules: Rule[]) {
      this.openGroupDialog(groupedRules, rule)
    }

    openGroupDialog(data: Rule[], rule : Rule): void {
      const rules = new BehaviorSubject<Rule[]>(data);
      const dialogData: RuleDialogData = {
        title: "Grouped Rules("+ rule.id + ")  > " + this.dialogData.title,
        data: rules,
        groupedRules: true
      }
      const dialogRef = this.dialog.open(RuleComponentConfig, {
          data: dialogData
      });

      dialogRef.afterClosed().subscribe((updatedData: Rule[] | undefined) => {
          if (updatedData) {
            rule.group = updatedData
          }
      });
    }

    addGroup() {
      const currentData = this.dialogData.data.value
      const groupEntry: Rule[] = []
      groupEntry.push({ id: groupEntry?.length ? (groupEntry?.length + 1 ) +"": "1", key: '', value: '', operator: 'AND', edit: true })
      groupEntry.push({ id: groupEntry?.length ? (groupEntry?.length + 1 ) +"": "1", key: '', value: '', operator: 'AND', edit: true })
      currentData.push({ id: currentData?.length ? (currentData?.length + 1 ) +"": "1", key: '', value: '', operator: 'AND', group: groupEntry, edit: true });
      this.dialogData.data.next(currentData);
    }

    deleteRule(rule: Rule) {
      this.alertService.alert("Are you sure you want to delete this rule?").subscribe((result) => {
        if (result) {
          const currentData = this.dialogData.data.value.filter(r => r !== rule);
          this.dialogData.data.next(currentData);
        }
      });
    }

    save() {
      this.dialogRef.close(this.dialogData.data.value);
    }
  }