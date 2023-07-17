import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import{HttpClientModule} from "@angular/common/http"
import { FormsModule } from '@angular/forms';


import { AppComponent } from './app.component';
import { IdDataComponent } from './id-data/id-data.component';
import { InfoComponent } from './info/info.component';
import { NeedsComponent } from './needs/needs.component';
import { PreviewComponent } from './preview/preview.component';

@NgModule({
  declarations: [
    AppComponent,
    IdDataComponent,
    InfoComponent,
    NeedsComponent,
    PreviewComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
