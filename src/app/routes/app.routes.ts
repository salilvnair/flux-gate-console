import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { AuthGuard } from "./guard/app-auth.guard";
import { UnauthorizedUserComponent } from "../components/unauthorized-user/unauthorized-user.component";
import { HomeComponent } from "../page/home/home.component";

const ROUTES: Routes = [
    { path: 'forbidden', component: UnauthorizedUserComponent},
    { path: '', component: HomeComponent , pathMatch:"full", canActivate:[ AuthGuard ] },
    { path: '**', redirectTo: '' }
]
 
@NgModule({
    imports:[ 
        RouterModule.forRoot(ROUTES)
     ],
    exports:[
        RouterModule
    ]
})

export class AppRoutingModule{}