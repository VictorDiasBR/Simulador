import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { MaterialModule } from "./material-module";
import {
  BrowserAnimationsModule,
  NoopAnimationsModule
} from "@angular/platform-browser/animations";
import { CdkTableModule } from "@angular/cdk/table";

import { HttpClientModule } from "@angular/common/http";
import { environment } from "../environments/environment";
import { AngularFireModule } from "@angular/fire";
import { AngularFireDatabaseModule } from "@angular/fire/database";
import { PlatformModule } from "@angular/cdk/platform";
import { ScrollingModule } from "@angular/cdk/scrolling";
import { FlexLayoutModule } from "@angular/flex-layout";
import { MatTableModule } from "@angular/material/table";

import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";
import {
  SimulacaoTSE,
  SimuladorComponent
} from "./simulador/simulador.component";
import { FormsModule } from "@angular/forms";
import { ReactiveFormsModule } from "@angular/forms";
import { JanelaComponent } from "./simulador/janela/janela.component";
import { UiControleComponent } from "./simulador/ui-controle/ui-controle.component";

@NgModule({
  declarations: [
    AppComponent,
    SimuladorComponent,
    JanelaComponent,
    UiControleComponent,
    SimulacaoTSE
  ],
  imports: [
    MatTableModule,
    CdkTableModule,
    FlexLayoutModule,
    ScrollingModule,
    ReactiveFormsModule,
    PlatformModule,
    BrowserModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    FormsModule,
    AppRoutingModule,
    MaterialModule,
    BrowserAnimationsModule,
    NoopAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
