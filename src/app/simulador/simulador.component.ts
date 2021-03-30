import {
  Component,
  OnInit,
  ChangeDetectorRef,
  ChangeDetectionStrategy
} from "@angular/core";
import { map } from "rxjs/operators";
import { FormControl, FormGroup } from "@angular/forms";
import { Breakpoints, BreakpointObserver } from "@angular/cdk/layout";
import { LabsService } from "../service/labs.service";
import { Observable } from "rxjs";
export interface Equip {
  nome: string;
  tipo: string;
  estado: string;
}
export interface Lab {
  nome: string;
  consumo: number;
  estado: string;
  equips: Equip[];
}

@Component({
  selector: "app-simulador",
  templateUrl: "./simulador.component.html",
  styleUrls: ["./simulador.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SimuladorComponent implements OnInit {
  gaugeType = "semi";
  gaugeconsumo = 60.3;
  gaugeLabel = "Speed";
  gaugeAppendText = "kw/hr";
  size = 150;

  color = "#90EE90";
  checked = true;
  checked1 = false;
  changed() {
    console.log(this.checked);
  }

  lab: any;
  equips: Equip[] = [
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
    { nome: "computador", tipo: "c", estado: "on" },
    { nome: "computador", tipo: "c", estado: "on" },
    { nome: "computador", tipo: "c", estado: "off" },
    { nome: "computador", tipo: "c", estado: "off" },
    { nome: "computador", tipo: "c", estado: "off" },
    { nome: "computador", tipo: "c", estado: "off" },
    { nome: "computador", tipo: "c", estado: "off" },
    { nome: "computador", tipo: "c", estado: "off" }
  ];
  labs: Lab[] = [
    { nome: "LAMI 1", consumo: 70.8, estado: "on", equips: this.equips },
    { nome: "LAMI 2", consumo: 20.8, estado: "on", equips: this.equips },
    { nome: "LAMI 3", consumo: 30.8, estado: "on", equips: this.equips },
    { nome: "LAMI 4", consumo: 60.2, estado: "on", equips: this.equips },
    { nome: "LAMI 5", consumo: 50.8, estado: "on", equips: this.equips },
    { nome: "LAMI 6", consumo: 0, estado: "off", equips: this.equips },
    { nome: "LAMI 7", consumo: 0, estado: "off", equips: this.equips },
    { nome: "LAMI 8", consumo: 0, estado: "off", equips: this.equips },
    { nome: "LAMI 9", consumo: 0, estado: "off", equips: this.equips },
    { nome: "LAMI 10", consumo: 0, estado: "off", equips: this.equips }
  ];

  constructor(
    private breakpointObserver: BreakpointObserver,
    public labsService: LabsService
  ) {
    this.labsService.listarLabs().subscribe((data) => {
      this.lab = data.map((e) => {
        return {
          id: e.payload.doc.id,
          nome: e.payload.doc.data()["nome"],
          consumo: e.payload.doc.data()["consumo"],
          estado: e.payload.doc.data()["estado"],
          equips: e.payload.doc.data()["equips"]
        };
      });

      console.log(this.lab);
    });
  }
  ngOnInit() {}
  /** Based on the screen size, switch from standard to one column per row */
  cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({ matches }) => {
      if (matches) {
        return this.lab;
      }

      return this.lab;
    })
  );
  criarLab() {
    let Lab = {};

    Lab["nome"] = "Lami 2";
    Lab["consumo"] = "80";
    Lab["estado"] = "on";
    Lab["equips"] = this.equips;

    this.labs.forEach((element) => {
      this.labsService
        .create_newLab(element)
        .then((res) => {
          console.log(res);
        })
        .catch((error) => {
          console.log(error);
        });
    });
  }

  updateLab() {
    let record = {};
    record["nome"] = "Lami editado";
    record["consumo"] = "30";
    record["estado"] = "off";
    record["equips"] = this.equips;
    this.labsService.updateLab("RLduKIh7kHN1KiuIinCd", record);
  }

  deleteLab() {
    this.labsService.deleteLab("lab");
  }
}
