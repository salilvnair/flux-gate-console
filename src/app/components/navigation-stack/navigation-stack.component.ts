import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from "@angular/core";
import { NavigationRoute } from "./navigation.router";

@Component({
  selector: "navigation-stack",
  templateUrl: "./navigation-stack.component.html",
  styleUrls: ["./navigation-stack.component.css"],
})
export class NavigationStackComponent implements OnInit, OnDestroy {
    @Input()
    navigationRoute: NavigationRoute | undefined;

    @Output()
    onNavBack: EventEmitter<any> = new EventEmitter<any>()

    ngOnInit(): void {
    }

    ngOnDestroy(): void {

    }

    handleNavBack() {
        this.onNavBack.emit(true)
    }
}