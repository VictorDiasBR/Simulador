import { AfterViewInit, Component, OnInit, Inject } from "@angular/core";
import { LabService } from "../service/lab.service";
import { LabDataService } from "../service/lab.data.service";
import { Lab, Equip } from "../service/lab";
import { Regra } from "../service/regra";
import { Observable } from "rxjs";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { STEPPER_GLOBAL_OPTIONS } from "@angular/cdk/stepper";
import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { MatDialog, MAT_DIALOG_DATA } from "@angular/material/dialog";

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
  snapshot: FormGroup;

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
    public dialog: MatDialog,
    private labService: LabService,
    private labDataService: LabDataService
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
    this.snapshot = this._formBuilder.group({
      snapshot: ["", Validators.required]
    });
  }

  simular(dados, tipo, periodo, modelo, snapshot) {
    if (tipo.tipo === "tSimulado") {
      this.dialog.open(SimulacaoTSE, {
        data: {
          dados: dados,
          tipo: tipo,
          periodo: periodo,
          modelo: modelo,
          snapshot: snapshot
        }
      });
    } else if (tipo.tipo === "tReal" && modelo.modelo === "dinamica") {
      this.dialog.open(SimulacaoTRD, {
        data: {
          dados: dados,
          tipo: tipo,
          periodo: periodo,
          modelo: modelo,
          snapshot: snapshot
        }
      });
    }
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
            if (this.simulacao.snapshot.snapshot === "snapshotUi") {
              if (j.nome === i.nome && id === j.id && i.estado === "on") {
                var temp = j.horas * this.diasDiff;
                var kw = i.potencia / 1000;
                var energia = kw * temp;
                var valor = this.bandeira * energia;

                j.custoTotal = Number((j.custoTotal + valor).toFixed(2));
              }
            } else {
              if (j.nome === i.nome && id === j.id) {
                var temp2 = j.horas * this.diasDiff;
                var kw2 = i.potencia / 1000;
                var energia2 = kw2 * temp2;
                var valor2 = this.bandeira * energia2;

                j.custoTotal = Number((j.custoTotal + valor2).toFixed(2));
              }
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
      .reduce((acc, value) => acc + value, 0)
      .toFixed(2);
  }
}

@Component({
  selector: "simulacao-trd",
  templateUrl: "./simulacao-trd.html",
  styleUrls: ["./simulacao-trd.css"]
})
export class SimulacaoTRD implements OnInit, AfterViewInit {
  simulacao: any;
  bandeira = 0.5;

  exe: any;
  key: any;

  labs: Observable<any>;

  nomesEquipsLab = [];

  regra: Regra;
  regras: Observable<any>;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: SimuacaoTSE,
    private labService: LabService,
    private labDataService: LabDataService
  ) {
    this.simulacao = data;
  }

  ngOnInit() {
    this.labs = this.labService.getAll();
    this.regras = this.labService.getAllRegras();
    var nomes = [];

    this.labs.forEach((element) => {
      element.forEach((element) => {
        element.equips.forEach((element) => {
          nomes.push(element.nome);
        });

        nomes.forEach((item) => {
          var duplicated =
            this.nomesEquipsLab.findIndex((redItem) => {
              return item === redItem;
            }) > -1;

          if (!duplicated) {
            this.nomesEquipsLab.push(item);
          }
        });
      });
    });
  }

  ngAfterViewInit() {
    this.labDataService.currentRegra.subscribe((data) => {
      this.regras = this.labService.getAllRegras();
    });
  }

  novaRegra() {
    this.regra = new Regra();
    this.regra = {
      laboratorio: "*",
      estadoLab: true,
      equipamento: "*",
      probEquip: 0
    };
    this.labService.insertRegra(this.regra);
    this.labDataService.changeRegra(this.regra, this.key);
  }

  salvarRegra(key, regra, lab, estado, equip, prob) {
    if (lab) {
      regra = {
        laboratorio: lab,
        estadoLab: estado,
        equipamento: equip,
        probEquip: prob
      };
    }

    this.labService.updateRegra(regra, key);
  }

  deletar(key) {
    this.labService.deleteRegra(key);
  }
  iniciarSimulacao() {
    this.exe = true;
    var monteCarlo = function () {
      // We do this “forever” until we find a qualifying random value.
      while (true) {
        // Pick a random value.
        var r1 = Math.random();
        // Assign a probability.
        var probability = r1;
        // Pick a second random value.
        var r2 = Math.random();
        // Does it qualify? If so, we’re done!
        if (r2 < probability) {
          return r1;
        }
      }
    };

      var loop = setInterval(() => {
        /* nvl 1 - percorrer regras */
        this.regras.forEach((element) => {
          element.forEach((regra) => {
            /* nvl 2 - percorrer labs */
            this.labs.forEach((element) => {
              element.forEach((lab) => {
                /* nvl 3 - filtrar regra lab */
                if (
                  regra.laboratorio === lab.nome &&
                  regra.estadoLab === lab.estado
                ) {
                  /* nvl 4 - percorrer equipamentos do lab */
                  lab.equips.forEach((equip) => {
                    /* nvl 5 - filtrar equipamentos da regra */
                    if (regra.equipamento === equip.nome) {
                      /* nvl 6 - gerar número aleatório */
                          var monteCarlo = monteCarlo();
                        /* nvl 6.1 - converter probabilidade para decimal */
                          var probabilidade = regra.probEquip/100;
                         /* nvl 7 - processo decisório 
                         (mudança de estado do equipamento ou não) */  
                          if(monteCarlo > probabilidade && equip.estado === "on"){
                              equip.estado="off";
                              this.labService.update(lab,lab.key);  
                          }else if(monteCarlo < probabilidade && equip.estado === "off"){
                            equip.estado="on";
                            this.labService.update(lab,lab.key);
                          }

                    }
                  });
                }
              });
            });
          });
        });
        if(this.exe===false){
          clearInterval(loop)
        }
      }, 1000);
  
  }
  pausarSimulacao() {
    this.exe = false;
  }
}
