import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class PageLocker {

    private _pagelockPublisher: BehaviorSubject<{lockText:string, lockStatus: boolean}> = new BehaviorSubject<{lockText:string, lockStatus: boolean}>({lockText:'', lockStatus: false});
    
    lockText: string = ''

    public pagelockPublisher() {
        return this._pagelockPublisher;
    }

    public lock(lockText?: string) {
        this.lockText = lockText ? lockText : 'Loading...';
        this._pagelockPublisher.next({lockText:this.lockText, lockStatus: true})
    }


    public unlock() {
        this._pagelockPublisher.next({lockText:this.lockText, lockStatus: false})
    }




}