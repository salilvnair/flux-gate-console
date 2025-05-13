import { Component, Input } from "@angular/core";

@Component({
  selector: "loader",
  templateUrl: "./loader.component.html",
  styleUrls: ["./loader.component.css"],
})
export class LoaderComponent {

  @Input()
  public text:string = "Loading..."


  
  @Input()
  public adjustMarginLeft:string = "0"

}