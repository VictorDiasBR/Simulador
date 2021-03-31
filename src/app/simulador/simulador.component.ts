import {
  Component,
  OnInit,
  ChangeDetectorRef,
  ChangeDetectionStrategy
} from "@angular/core";
import { map } from "rxjs/operators";

import { Breakpoints, BreakpointObserver } from "@angular/cdk/layout";
import { LabsService } from "../service/labs.service";

export interface Equip {
  id: number;
  nome: string;
  tipo: string;
  estado: string;
}
export interface Lab {
  nome: string;
  consumo: number;
  estado: string;
  equips: Equip[];
  aula: boolean;
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
  mode = true;
  lab: any;

  data: any;
  equips: Equip[] = [
    { id: 1, nome: "Ar Condicionado", tipo: "a", estado: "on" },
    { id: 2, nome: "Ar Condicionado", tipo: "a", estado: "off" },
    { id: 3, nome: "Ar Condicionado", tipo: "a", estado: "on" },
    { id: 4, nome: "Ar Condicionado", tipo: "a", estado: "off" },
    { id: 5, nome: "projetor", tipo: "p", estado: "on" },
    { id: 6, nome: "lampada", tipo: "l", estado: "on" },
    { id: 7, nome: "lampada", tipo: "l", estado: "off" },
    { id: 8, nome: "computador", tipo: "c", estado: "on" },
    { id: 9, nome: "computador", tipo: "c", estado: "on" },
    { id: 10, nome: "computador", tipo: "c", estado: "on" },
    { id: 11, nome: "computador", tipo: "c", estado: "on" },
    { id: 12, nome: "computador", tipo: "c", estado: "on" },
    { id: 13, nome: "computador", tipo: "c", estado: "on" },
    { id: 14, nome: "computador", tipo: "c", estado: "on" },
    { id: 15, nome: "computador", tipo: "c", estado: "on" },
    { id: 16, nome: "computador", tipo: "c", estado: "on" },
    { id: 17, nome: "computador", tipo: "c", estado: "on" },
    { id: 18, nome: "computador", tipo: "c", estado: "on" },
    { id: 19, nome: "computador", tipo: "c", estado: "off" },
    { id: 20, nome: "computador", tipo: "c", estado: "off" },
    { id: 21, nome: "computador", tipo: "c", estado: "off" },
    { id: 22, nome: "computador", tipo: "c", estado: "off" },
    { id: 23, nome: "computador", tipo: "c", estado: "off" },
    { id: 24, nome: "computador", tipo: "c", estado: "off" }
  ];
  labs: Lab[] = [
    {
      nome: "LAMI 1",
      consumo: 70.8,
      estado: "on",
      equips: this.equips,
      aula: true
    },
    {
      nome: "LAMI 2",
      consumo: 20.8,
      estado: "on",
      equips: this.equips,
      aula: true
    },
    {
      nome: "LAMI 3",
      consumo: 30.8,
      estado: "on",
      equips: this.equips,
      aula: false
    },
    {
      nome: "LAMI 4",
      consumo: 60.2,
      estado: "on",
      equips: this.equips,
      aula: false
    },
    {
      nome: "LAMI 5",
      consumo: 50.8,
      estado: "on",
      equips: this.equips,
      aula: true
    },
    {
      nome: "LAMI 6",
      consumo: 90,
      estado: "off",
      equips: this.equips,
      aula: false
    },
    {
      nome: "LAMI 7",
      consumo: 80,
      estado: "off",
      equips: this.equips,
      aula: false
    },
    {
      nome: "LAMI 8",
      consumo: 70,
      estado: "off",
      equips: this.equips,
      aula: false
    },
    {
      nome: "LAMI 9",
      consumo: 60,
      estado: "off",
      equips: this.equips,
      aula: false
    },
    {
      nome: "LAMI 10",
      consumo: 60,
      estado: "off",
      equips: this.equips,
      aula: false
    }
  ];

  constructor(
    private breakpointObserver: BreakpointObserver,
    public labsService: LabsService,
    private changeDetector: ChangeDetectorRef
  ) {}
  ngOnInit() {
    this.labsService.listarLabs().subscribe((data) => {
      this.lab = data.map((e) => {
        return {
          id: e.payload.doc.id,
          nome: e.payload.doc.data()["nome"],
          consumo: e.payload.doc.data()["consumo"],
          estado: e.payload.doc.data()["estado"],
          equips: e.payload.doc.data()["equips"],
          aula: e.payload.doc.data()["aula"]
        };
      });
      console.log(this.lab);
    });

    this.changeDetector.markForCheck();
  }
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

  updateEstadoLab(id, estado, aula) {
    let record = {};

    if (estado === "on" && aula === true) {
      record["estado"] = "off";
      record["aula"] = false;
    } else if (estado === "off") {
      record["estado"] = "on";
    } else if (estado === "on") {
      record["estado"] = "off";
    }
    this.labsService.updateLab(id, record);
  }

  updateAulaLab(id, aula, estado) {
    let record = {};

    if (aula === false && estado === "off") {
      record["aula"] = true;
      record["estado"] = "on";
    } else if (aula === true) {
      record["aula"] = false;
    } else if (aula === false) {
      record["aula"] = true;
    }
    this.labsService.updateLab(id, record);
  }

  updateEquipLab(lId, eId, equipEstado, labEstado) {
    let record = {};

    if (labEstado === "off" && equipEstado === "off") {
      record["equips/estado"] = "on";
      record["estado"] = "on";
    } else if (equipEstado === "off") {
      record["equips/estado"] = "on";
    } else if (equipEstado === "on") {
      record["equips/estado"] = "off";
    }

    this.labsService.updateEquip(lId, eId, record);
  }

  deleteLab() {
    this.labsService.deleteLab("lab");
  }
}
