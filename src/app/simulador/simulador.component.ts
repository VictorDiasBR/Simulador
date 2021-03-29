import { Component, OnInit } from "@angular/core";
import { map } from "rxjs/operators";
import { FormControl, FormGroup } from "@angular/forms";
import { Breakpoints, BreakpointObserver } from "@angular/cdk/layout";
export interface Lab {
  nome: string;
  tipo: string;
  estado: string;
}
@Component({
  selector: "app-simulador",
  templateUrl: "./simulador.component.html",
  styleUrls: ["./simulador.component.css"]
})
export class SimuladorComponent {
  gaugeType = "semi";
  gaugeValue = 60.3;
  gaugeLabel = "Speed";
  gaugeAppendText = "kw/hr";
  size = 150;

  color = "#90EE90";
  checked = true;
  checked1 = false;
  changed() {
    console.log(this.checked);
  }

  lab = new FormGroup({
    title: new FormControl(""),
    value: new FormControl(""),
    estado: new FormControl("")
  });

  equips: Lab[] = [
    { nome: "Ar Condicionado", tipo: "a", estado: "on" },
    { nome: "Ar Condicionado", tipo: "a", estado: "off" },
    { nome: "Ar Condicionado", tipo: "a", estado: "on" },
    { nome: "Ar Condicionado", tipo: "a", estado: "off" },
    { nome: "projetor", tipo: "p", estado: "on" },
    { nome: "lampada", tipo: "l", estado: "on" },
    { nome: "lampada", tipo: "l", estado: "off" },
    { nome: "computador", tipo: "c", estado: "on" },
    { nome: "computador", tipo: "c", estado: "on" },
    { nome: "computador", tipo: "c", estado: "on" },
    { nome: "computador", tipo: "c", estado: "on" },
    { nome: "computador", tipo: "c", estado: "on" },
    { nome: "computador", tipo: "c", estado: "on" },
    { nome: "computador", tipo: "c", estado: "on" },
    { nome: "computador", tipo: "c", estado: "on" },
    { nome: "computador", tipo: "c", estado: "on" },
    { nome: "computador", tipo: "c", estado: "off" },
    { nome: "computador", tipo: "c", estado: "off" },
    { nome: "computador", tipo: "c", estado: "off" },
    { nome: "computador", tipo: "c", estado: "off" },
    { nome: "computador", tipo: "c", estado: "off" },
    { nome: "computador", tipo: "c", estado: "off" },
    { nome: "computador", tipo: "c", estado: "off" },
    { nome: "computador", tipo: "c", estado: "off" }
  ];

  /** Based on the screen size, switch from standard to one column per row */
  cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({ matches }) => {
      if (matches) {
        return [
          { title: "LAMI 1" },
          { title: "LAMI 2" },
          { title: "LAMI 3" },
          { title: "LAMI 4" }
        ];
      }

      return [
        { title: "LAMI 1", value: 70.8, estado: "on", equips: this.equips },
        { title: "LAMI 2", value: 20.8, estado: "on", equips: this.equips },
        { title: "LAMI 3", value: 30.8, estado: "on", equips: this.equips },
        { title: "LAMI 4", value: 60.2, estado: "on", equips: this.equips },
        { title: "LAMI 5", value: 50.8, estado: "on", equips: this.equips },
        { title: "LAMI 6", value: 0, estado: "off", equips: this.equips },
        { title: "LAMI 7", value: 0, estado: "off", equips: this.equips },
        { title: "LAMI 8", value: 0, estado: "off", equips: this.equips },
        { title: "LAMI 9", value: 0, estado: "off", equips: this.equips },
        { title: "LAMI 10", value: 0, estado: "off", equips: this.equips }
      ];
    })
  );

  constructor(private breakpointObserver: BreakpointObserver) {}
}
