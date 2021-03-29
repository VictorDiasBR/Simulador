import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { MaterialModule } from "./material-module";
import {
  BrowserAnimationsModule,
  NoopAnimationsModule
} from "@angular/platform-browser/animations";
import { NgxGaugeModule } from "ngx-gauge";

import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";
import { SimuladorComponent } from "./simulador/simulador.component";
import { FormsModule } from "@angular/forms";

@NgModule({
  declarations: [AppComponent, SimuladorComponent],
  imports: [
    BrowserModule,
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
