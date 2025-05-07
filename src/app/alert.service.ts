import { Injectable } from "@angular/core";
import { MatDialog } from '@angular/material/dialog';
import { AlertDialog } from "./alert.component";

@Injectable({
    providedIn: 'root'
})
export class AlertService {
    constructor(public dialog: MatDialog) {}

    alert(message: string) {
        let dialogRef = this.dialog.open(AlertDialog, {
          width: '450px',
          data: message
        });
        return dialogRef.afterClosed()
    }

}