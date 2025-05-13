import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { PageLocker } from './page-locker.service';

@Component({
    selector: 'page-locker',
    templateUrl: './page-locker.component.html',
    styleUrls: ['./page-locker.component.css']
})
export class PageLockerComponent implements OnInit, OnDestroy {

    private _locked = false;

    @Input('locked') 
    get locked(): boolean {
        return this._locked;
    }
    set locked(value: boolean) {
        this._locked = "" + value !== "false";
    }

    @Input()
    lockText: string = 'Please wait...'

    pageLockSubscription:Subscription | undefined;

    constructor(private pageLocker: PageLocker) { }

    ngOnInit(): void { 
        this.pageLockSubscription = this.pageLocker.pagelockPublisher().subscribe((lockInfo: { lockStatus: boolean; lockText: string; }) => {
            this._locked = lockInfo.lockStatus
            this.lockText = lockInfo.lockText ? lockInfo.lockText : this.lockText
        })
    }

    ngOnDestroy() {
        this.pageLockSubscription?.unsubscribe();
    }
}
