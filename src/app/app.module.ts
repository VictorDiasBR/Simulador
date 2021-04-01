import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { MaterialModule } from "./material-module";
import {
  BrowserAnimationsModule,
  NoopAnimationsModule
} from "@angular/platform-browser/animations";
import { NgxGaugeModule } from "ngx-gauge";

import { HttpClientModule } from "@angular/common/http";

import { environment } from "../environments/environment";

import { AngularFireModule } from "@angular/fire";
import { AngularFireDatabaseModule } from "@angular/fire/database";

import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";
import { SimuladorComponent } from "./simulador/simulador.component";
import { FormsModule } from "@angular/forms";

import { LabDataService } from "./service/lab.data.service";
import { JanelaComponent } from "./simulador/janela/janela.component";
@NgModule({
  declarations: [AppComponent, SimuladorComponent, JanelaComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    FormsModule,
    AppRoutingModule,
    MaterialModule,
    BrowserAnimationsModule,
    NoopAnimationsModule,
    NgxGaugeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
