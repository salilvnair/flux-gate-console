import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
    selector: 'alert',
    templateUrl: 'alert.component.html',
  })
  export class AlertDialog {
    constructor(
        public dialogRef: MatDialogRef<AlertDialog>,
        @Inject(MAT_DIALOG_DATA) public data: string,
    ) {}

    handleYes() {
        this.dialogRef.close(true);
    }

    handleCancel() {
        this.dialogRef.close(false);
    }
}