import {
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  AfterViewInit,
  Component,
  OnInit,
  ViewChild,
  Inject,
  OnChanges,
  AfterViewChecked
} from "@angular/core";
import { LabService } from "../service/lab.service";
import { LabDataService } from "../service/lab.data.service";
import { Lab, Equip } from "../service/lab";
import { Observable } from "rxjs";
import { JanelaComponent } from "./janela/janela.component";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators
} from "@angular/forms";
import { STEPPER_GLOBAL_OPTIONS } from "@angular/cdk/stepper";
import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { MatDialog, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { NgForm } from "@angular/forms";
import { isNgTemplate } from "@angular/compiler";

export interface SimuacaoTSE {
  dados: any;
  tipo: any;
  periodo: any;
  modelo: any;
}

@Component({
  selector: "app-simulador",
  templateUrl: "./simulador.component.html",
  styleUrls: ["./simulador.component.css"],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { showError: true }
    }
  ]
})
export class SimuladorComponent implements OnInit {
  dadosIniciais: FormGroup;
  tipo: FormGroup;
  periodo: FormGroup;
  modelo: FormGroup;

  cols: number;

  gridByBreakpoint = {
    xl: 2,
    lg: 2,
    md: 2,
    sm: 1,
    xs: 1
  };
  constructor(
    private _formBuilder: FormBuilder,
    private breakpointObserver: BreakpointObserver,
    public dialog: MatDialog
  ) {
    this.breakpointObserver
      .observe([
        Breakpoints.XSmall,
        Breakpoints.Small,
        Breakpoints.Medium,
        Breakpoints.Large,
        Breakpoints.XLarge
      ])
      .subscribe((result) => {
        if (result.matches) {
          if (result.breakpoints[Breakpoints.XSmall]) {
            this.cols = this.gridByBreakpoint.xs;
          }
          if (result.breakpoints[Breakpoints.Small]) {
            this.cols = this.gridByBreakpoint.sm;
          }
          if (result.breakpoints[Breakpoints.Medium]) {
            this.cols = this.gridByBreakpoint.md;
          }
          if (result.breakpoints[Breakpoints.Large]) {
            this.cols = this.gridByBreakpoint.lg;
          }
          if (result.breakpoints[Breakpoints.XLarge]) {
            this.cols = this.gridByBreakpoint.xl;
          }
        }
      });
  }

  ngOnInit() {
    this.dadosIniciais = this._formBuilder.group({
      nome: ["", Validators.required],
      descricao: ["", Validators.required]
    });
    this.tipo = this._formBuilder.group({
      tipo: ["", Validators.required]
    });

    this.periodo = this._formBuilder.group({
      inicio: ["", Validators.required],
      fim: ["", Validators.required]
    });

    this.modelo = this._formBuilder.group({
      modelo: ["", Validators.required]
    });
  }

  simular(dados, tipo, periodo, modelo) {
    this.dialog.open(SimulacaoTSE, {
      data: {
        dados: dados,
        tipo: tipo,
        periodo: periodo,
        modelo: modelo
      }
    });
  }
}

export interface Item {
  id: number;
  nome: string;
  horas: number;
  custoTotal: number;
}
@Component({
  selector: "simulacao-tse",
  templateUrl: "./simulacao-tse.html",
  styleUrls: ["./simulacao-tse.css"]
})
export class SimulacaoTSE implements OnInit, AfterViewInit {
  simulacao: any;
  labs: Observable<any>;
  equips: Item[] = [];
  diasDiff: any;

  bandeira = 0.5;
  dataInicio: any;
  dataFim: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: SimuacaoTSE,
    private labService: LabService,
    private labDataService: LabDataService
  ) {
    this.simulacao = data;
  }
  displayedColumns: string[] = ["nome", "horas", "custoTotal"];

  formatLabel(value: number) {
    return Math.round(value) + "h";
  }

  ngAfterViewInit() {}
  ngOnInit() {
    this.labs = this.labService.getAll();
    var nomes = [];
    var nomesEquips = [];
    this.labs.forEach((element) => {
      element.forEach((element) => {
        element.equips.forEach((element) => {
          nomes.push(element.nome);
        });

        nomes.forEach((item) => {
          var duplicated =
            nomesEquips.findIndex((redItem) => {
              return item === redItem;
            }) > -1;

          if (!duplicated) {
            nomesEquips.push(item);
          }
        });
      });
      var count = 0;
      for (let i of nomesEquips) {
        var xd: Item = {
          id: count++,
          nome: i,
          horas: 0,
          custoTotal: 0
        };
        this.equips.push(xd);
      }
      this.equips = this.equips.concat();
    });

    var dataInicio = this.simulacao.periodo.inicio.toLocaleDateString("pt-BR", {
      timeZone: "UTC"
    });
    var dataFim = this.simulacao.periodo.fim.toLocaleDateString("pt-BR", {
      timeZone: "UTC"
    });
    this.dataInicio = dataInicio;
    this.dataFim = dataFim;
    var dias = Math.abs(
      this.simulacao.periodo.inicio.getDate() -
        this.simulacao.periodo.fim.getDate()
    );
    this.diasDiff = dias;
  }

  onChange(newValue, id) {
    for (let i of this.equips) {
      if (id === i.id) {
        i.horas = newValue;
        i.custoTotal = 0;
      }
    }

    this.labs.forEach((element) => {
      element.forEach((element) => {
        for (const j of this.equips) {
          for (const i of element.equips) {
            if (j.nome === i.nome && id === j.id) {
              var temp = j.horas * this.diasDiff;
              var kw = i.potencia / 1000;
              var energia = kw * temp;
              var valor = this.bandeira * energia;

              j.custoTotal = Number((j.custoTotal + valor).toFixed(2));
            }
          }
        }
      });
    });
    this.equips = this.equips.concat();
  }
  /** Gets the total cost of all transactions. */
  getTotalCost() {
    return this.equips
      .map((t) => t.custoTotal)
      .reduce((acc, value) => acc + value, 0);
  }
}
