import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { MaterialModule } from "./material-module";
import {
  BrowserAnimationsModule,
  NoopAnimationsModule
} from "@angular/platform-browser/animations";
import { NgxGaugeModule } from "ngx-gauge";

import { HttpClientModule } from "@angular/common/http";
import { AngularFireModule } from "@angular/fire";
import { environment } from "../environments/environment";
import { AngularFirestoreModule } from "@angular/fire/firestore";

import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";
import { SimuladorComponent } from "./simulador/simulador.component";
import { FormsModule } from "@angular/forms";

import { LabsService } from "./service/labs.service";
@NgModule({
  declarations: [AppComponent, SimuladorComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    FormsModule,
    AppRoutingModule,
    MaterialModule,
    BrowserAnimationsModule,
    NoopAnimationsModule,
    NgxGaugeModule
  ],
  providers: [LabsService],
  bootstrap: [AppComponent]
})
export class AppModule {}
