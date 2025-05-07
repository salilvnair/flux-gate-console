import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';

// Import Angular Material Modules
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import {MatDialogModule} from '@angular/material/dialog';
import {MatTabsModule} from '@angular/material/tabs';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatTooltipModule} from '@angular/material/tooltip';


// Import the Angular CDK Modules
import { CdkTableModule } from '@angular/cdk/table';
import { FormsModule } from '@angular/forms';
import { ConfigComponentDialog } from './config.component';
import { RuleComponentConfig } from './rule.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ApiConfigComponent } from './api-config.component';
import { UrlConfigComponent } from './url-config.component';
import { HttpClientModule } from '@angular/common/http';
import { AlertDialog } from './alert.component';
import { DefaultConfigComponent } from './default-config.component';

@NgModule({
  declarations: [
    AppComponent,
    ConfigComponentDialog,
    RuleComponentConfig,
    ApiConfigComponent,
    UrlConfigComponent,
    AlertDialog,
    DefaultConfigComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatDialogModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatTooltipModule,
    MatSelectModule,
    MatTabsModule,
    MatCardModule,
    CdkTableModule, 
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
