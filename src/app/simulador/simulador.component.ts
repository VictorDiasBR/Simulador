import { AfterViewInit, Component, OnInit, Inject } from "@angular/core";
import { LabService } from "../service/lab.service";
import { LabDataService } from "../service/lab.data.service";
import { Lab, Equip, Regra, Simulacao, Log } from "../service/lab";
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
  selector: "simulacao-trd",
  templateUrl: "./simulacao-trd.html",
  styleUrls: ["./simulacao-trd.css"]
})
export class SimulacaoTRD implements OnInit, AfterViewInit {
  dataSimulacao: any;
  bandeira = 0.5;
  exe: any;
  key: any;
  timer: any;

  labs: Observable<any>;
  loop: any;
  nomesEquipsLab = [];
  regra: Regra;
  regras: Observable<any>;
  listaSnapshots: any = [];
  listaRegras: Regra[] = [];
  simulacoes: Observable<any>;
  simulacao: any;
  simulacaoEstatica: any;
  horas: number = 0;
  minutos: number = 0;
  segundos: number = 0;
  editSimulacao: string = "";
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: SimuacaoTSE,
    private labService: LabService,
    private labDataService: LabDataService
  ) {
    this.dataSimulacao = data;
  }

  ngOnInit() {
    this.labs = this.labService.getAll();
    this.regras = this.labService.getAllRegras();
    this.simulacoes = this.labService.getAllSimulacoes();

    this.labs.forEach((element) => {
      element.forEach((lab) => {
        for (const equip of lab.equips) {
          var listaOn = [];
          if (equip.estado === "on") {
            listaOn.push(new Date().toLocaleString());
          } else {
            listaOn.push("*");
          }

          var aux2 = {
            nomeLab: lab.nome,
            equip: equip,
            equipDateOn: listaOn
          };
          this.listaSnapshots.push(aux2);
        }
      });
    });
    this.regras.forEach((element) => {
      this.listaRegras = [];
      element.forEach((regra) => {
        this.listaRegras.push(regra);
      });
    });
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
    this.labDataService.currentSimulacao.subscribe((data) => {
      if (data.simulacao && data.key) {
        this.simulacao = data.simulacao;
      }
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
    this.regra = new Regra();

    var state: boolean = true;
    if (estado === "false") {
      state = false;
    }
    this.regra = {
      laboratorio: lab,
      estadoLab: state,
      equipamento: equip,
      probEquip: Number(prob)
    };

    this.labService.updateRegra(this.regra, key);
  }

  deletar(key) {
    this.labService.deleteRegra(key);
  }

  monteCarlo() {
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
  }
  count1: number = 0;
  novaSimulacaoDinamica() {
    var countx = 0;
    this.simulacoes.forEach((element) => {
      countx++;
      if (countx === 1) {
        element.forEach((s) => {
          if (s.estadoSimulacao === true) {
            s.estadoSimulacao = false;
            this.labService.updateSimulacao(s, s.key);
          }
        });
      }
    });
    var log: Log = {
      inicioSimulacao: new Date().toLocaleString()
    };
    var logs: Log[] = [];
    logs.push(log);

    var simulacao: Simulacao = {
      estadoSimulacao: true,
      titulo: this.dataSimulacao.dados.nome,
      descricao: this.dataSimulacao.dados.descricao,
      modalidadeTempo: this.dataSimulacao.tipo.tipo,
      modelo: this.dataSimulacao.modelo.modelo,
      snapshotLabs: this.listaSnapshots,
      regras: this.listaRegras,
      dateTimeInicio: new Date().toLocaleString(),
      log: logs
    };
    this.labService.insertSimulacao(simulacao);
    var count = 0;
    this.simulacoes.forEach((element) => {
      count++;
      if (count === 1) {
        element.forEach((s) => {
          if (s.estadoSimulacao === true) {
            this.iniciarSimulacaoDinamica(s);
          }
        });
      }
    });
  }

  iniciarSimulacaoDinamica(simulacao: any) {
    var countx = 0;
    this.simulacoes.forEach((element) => {
      countx++;
      if (countx === 1) {
        element.forEach((s) => {
          if (s.estadoSimulacao === true) {
            s.estadoSimulacao = false;
            this.labService.updateSimulacao(s, s.key);
          }
        });
      }
    });
    simulacao.estadoSimulacao = true;
    this.labService.updateSimulacao(simulacao, simulacao.key);
    this.labDataService.changeSimulacao(simulacao, simulacao.key);
    this.timer = setInterval(() => {
      this.segundos++;
      if (this.segundos === 60) {
        this.segundos = 0;
        this.minutos++;
        if (this.minutos === 60) {
          this.minutos = 0;
          this.horas++;
          if (this.horas === 24) {
            this.horas = 0;
          }
        }
      }
    }, 1000);

    var count = 0;
    /* nvl 1 - percorrer labs */
    this.labs.forEach((element) => {
      count++;
      if (count === 1) {
        this.labs.forEach((l) => {
          this.count1++;
          if (this.count1 === 1) {
            l.forEach((lab1) => {
              lab1.equips.forEach((equip1) => {
                if (equip1.estado === "on") {
                  equip1.dateTimeOn = new Date().toLocaleString();

                  for (var s3 of this.simulacao.snapshotLabs) {
                    if (lab1.nome === s3.nomeLab && equip1.id === s3.equip.id) {
                      var achou3 = s3.equipDateOn.filter(
                        (item) =>
                          item.slice(0, 10) === equip1.dateTimeOn.slice(0, 10)
                      );
                      if (achou3.length === 0) {
                        s3.equipDateOn.push(equip1.dateTimeOn);
                        this.labService.updateSimulacao(
                          this.simulacao,
                          this.simulacao.key
                        );
                      }
                    }
                  }
                } else {
                  equip1.dateTimeOn = "*";
                }
              });
              this.labService.update(lab1, lab1.key);
            });
          }
        });

        this.loop = setInterval(() => {
          element.forEach((lab) => {
            /* nvl 2 - percorrer regras */
            this.regras.forEach((element) => {
              element.forEach((regra) => {
                /* nvl 3 - filtrar regra lab */

                if (
                  regra.laboratorio === lab.nome &&
                  regra.estadoLab === lab.aula
                ) {
                  /* nvl 4 - percorrer equipamentos do lab */
                  lab.equips.forEach((equip) => {
                    /* nvl 5 - filtrar equipamentos da regra */
                    if (regra.equipamento === equip.nome) {
                      /* nvl 6 - gerar número aleatório */
                      var monteCarlo = this.monteCarlo();
                      /* nvl 6.1 - converter probabilidade para decimal */
                      var probabilidade = regra.probEquip / 100;
                      /* nvl 7 - processo decisório 
                         (mudança de estado do equipamento ou não) */
                      if (equip.estado === "off" && probabilidade === 1) {
                        equip.estado = "on";
                        equip.dateTimeOn = new Date().toLocaleString();
                        lab.consumo += equip.potencia / 1000;
                        var consumo1 = 0;
                        consumo1 = lab.consumo;
                        lab.consumo = Number(consumo1.toFixed(2));
                        this.labService.update(lab, lab.key);
                        for (var s1 of this.simulacao.snapshotLabs) {
                          if (
                            lab.nome === s1.nomeLab &&
                            equip.id === s1.equip.id
                          ) {
                            var achou = s1.equipDateOn.filter(
                              (item) =>
                                item.slice(0, 10) ===
                                equip.dateTimeOn.slice(0, 10)
                            );

                            if (achou) {
                              s1.equipDateOn.forEach((x2) => {
                                if (
                                  x2.slice(0, 10) ===
                                  equip.dateTimeOn.slice(0, 10)
                                ) {
                                  s1.equipDateOn[s1.equipDateOn.indexOf(x2)] =
                                    equip.dateTimeOn;

                                  this.labService.updateSimulacao(
                                    this.simulacao,
                                    this.simulacao.key
                                  );
                                }
                              });
                            } else {
                              s1.equipDateOn.push(equip.dateTimeOn);
                              this.labService.updateSimulacao(
                                this.simulacao,
                                this.simulacao.key
                              );
                            }
                          }
                        }
                      } else if (probabilidade === 0 && equip.estado === "on") {
                        equip.estado = "off";
                        lab.consumo -= equip.potencia / 1000;
                        var consumo2 = 0;
                        consumo2 = lab.consumo;
                        lab.consumo = Number(consumo2.toFixed(2));
                        this.labService.update(lab, lab.key);

                        if (this.simulacao.estadoSimulacao === true) {
                          var log: Log = {
                            labNome: lab.nome,
                            equipamento: equip,
                            dateTimeOn: equip.dateTimeOn,
                            dateTimeOff: new Date().toLocaleString()
                          };

                          this.simulacao.log.push(log);
                          this.labService.updateSimulacao(
                            this.simulacao,
                            this.simulacao.key
                          );
                        }
                      } else if (
                        monteCarlo < probabilidade &&
                        equip.estado === "off" &&
                        probabilidade > 0
                      ) {
                        equip.estado = "on";
                        equip.dateTimeOn = new Date().toLocaleString();
                        lab.consumo += equip.potencia / 1000;
                        var consumo3 = 0;
                        consumo3 = lab.consumo;
                        lab.consumo = Number(consumo3.toFixed(2));
                        this.labService.update(lab, lab.key);

                        for (var s of this.simulacao.snapshotLabs) {
                          if (
                            lab.nome === s.nomeLab &&
                            equip.id === s.equip.id
                          ) {
                            var achou2 = s.equipDateOn.filter(
                              (item) =>
                                item.slice(0, 10) ===
                                equip.dateTimeOn.slice(0, 10)
                            );

                            if (achou2.length > 0) {
                              s.equipDateOn.forEach((x2) => {
                                if (
                                  x2.slice(0, 10) ===
                                  equip.dateTimeOn.slice(0, 10)
                                ) {
                                  s.equipDateOn[s.equipDateOn.indexOf(x2)] =
                                    equip.dateTimeOn;

                                  this.labService.updateSimulacao(
                                    this.simulacao,
                                    this.simulacao.key
                                  );
                                }
                              });
                            } else {
                              s.equipDateOn.push(equip.dateTimeOn);
                              this.labService.updateSimulacao(
                                this.simulacao,
                                this.simulacao.key
                              );
                            }
                          }
                        }
                      } else if (
                        monteCarlo > probabilidade &&
                        equip.estado === "on"
                      ) {
                        equip.estado = "off";
                        lab.consumo -= equip.potencia / 1000;
                        var consumo4 = 0;
                        consumo4 = lab.consumo;
                        lab.consumo = Number(consumo4.toFixed(2));
                        this.labService.update(lab, lab.key);

                        if (this.simulacao.estadoSimulacao === true) {
                          var log2: Log = {
                            labNome: lab.nome,
                            equipamento: equip,
                            dateTimeOn: equip.dateTimeOn,
                            dateTimeOff: new Date().toLocaleString()
                          };

                          this.simulacao.log.push(log2);
                          this.labService.updateSimulacao(
                            this.simulacao,
                            this.simulacao.key
                          );
                        }
                      }
                    }
                  });
                }
              });
            });
          });
        }, 10000);
      }
    });
  }
  setarDatetimeEquips(dateTimeOn: string) {}
  iniciarSimulacaoEstatica() {
    var count1=0;


      
    
    var log: Log = {
      inicioSimulacao: new Date().toLocaleString()
    };
    var logs: Log[] = [];
    logs.push(log);

    var dataInicio = this.dataSimulacao.periodo.inicio.toLocaleString(
      "pt-BR",
      {
        timeZone: "UTC"
      }
    );
    var dataFim = this.dataSimulacao.periodo.fim.toLocaleString("pt-BR", {
      timeZone: "UTC"
    });

    
    var simulacao: Simulacao = {
      estadoSimulacao: true,
      titulo: this.dataSimulacao.dados.nome,
      descricao: this.dataSimulacao.dados.descricao,
      modalidadeTempo: this.dataSimulacao.tipo.tipo,
      modelo: this.dataSimulacao.modelo.modelo,
      snapshotLabs: this.listaSnapshots,
      regras: this.listaRegras,
      dateTimeInicio: new Date().toLocaleString(),
      log: logs,
      pInicio: dataInicio,
      pFim: dataFim
    };
    var countS =0;
    this.labService.insertSimulacao(simulacao);
    this.simulacoes.forEach((element) => {
      countS++;
      if (countS === 1) {
        element.forEach((simulacao) => {
          if (
            simulacao.estadoSimulacao === true &&
            simulacao.modelo !== "dinamica"
          ) {
           
            console.log(simulacao.pInicio);
            console.log(simulacao.pFim);
            var dias =
              Math.abs(
                new Date(
                  simulacao.pInicio.slice(6, 10),
                  simulacao.pInicio.slice(3, 5),
                  simulacao.pInicio.slice(0, 2),
                  simulacao.pInicio.slice(11, 13),
                  simulacao.pInicio.slice(14, 16),
                  simulacao.pInicio.slice(17, 19)
                ).getDate() -
                  new Date(
                    simulacao.pFim.slice(6, 10),
                    simulacao.pFim.slice(3, 5),
                    simulacao.pFim.slice(0, 2),
                    simulacao.pFim.slice(11, 13),
                    simulacao.pFim.slice(14, 16),
                    simulacao.pFim.slice(17, 19)
                  ).getDate()
              ) + 1;
              this.labs.forEach((l) => {
                count1++;
                if (count1 === 1) {
                  l.forEach((lab1) => {
                    lab1.equips.forEach((equip1) => {
                      if (equip1.estado === "on") {
                        equip1.dateTimeOn = simulacao.pInicio;
        
                      } else {
                        equip1.dateTimeOn = "*";
                      }
                    });
                    this.labService.update(lab1, lab1.key);
                  });
                }
              });
            /* nvl 1 - percorrer dias do período selecionado pelo usuário */
            for (let indexDia = 1; indexDia <= dias; indexDia++) {
              console.log(indexDia);
              /* nvl 2 - percorrer horas do dia */
              for (let indexHora = 1; indexHora <= 24; indexHora++) {
                /* nvl 2.5 - processar somente horário de expediente */
                if (indexHora >= 7 && indexHora <= 22) {
                  /* nvl 3 - percorrer minutos da hora */
                  for (let indexMin = 1; indexMin <= 60; indexMin++) {
                    /* nvl 4 - percorrer labs */
                   this.processar(simulacao,indexDia,indexHora,indexMin);
                  }
                }
              }
            }
          }
        });
      }
    });
  }
  processar(simulacao:any,indexDia,indexHora,indexMin){

   var count =0;
    this.labs.forEach((element) => {
      console.log("xd")
      count++;
      if (count === 1) {
        element.forEach((lab) => {
          /* nvl 5 - percorrer regras */
          this.regras.forEach((element) => {
            element.forEach((regra) => {
              /* nvl 6 - filtrar regra lab */

              if (
                regra.laboratorio === lab.nome &&
                regra.estadoLab === lab.aula
              ) {
                /* nvl 7 - percorrer equipamentos do lab */
                lab.equips.forEach((equip) => {
                  /* nvl 8 - filtrar equipamentos da regra */
                  if (regra.equipamento === equip.nome) {
                    console.log(equip.nome)
                    /* nvl 9 - gerar número aleatório */
                    var monteCarlo = this.monteCarlo();
                    /* nvl 9.1 - converter probabilidade para decimal */
                    var probabilidade = regra.probEquip / 100;
                    /* nvl 10 - processo decisório 
   (mudança de estado do equipamento ou não) */
                    if (
                      equip.estado === "off" &&
                      probabilidade === 1
                    ) {
                      equip.estado = "on";
                      var d1 =new Date();
                      d1.setDate(new Date( 
                      simulacao.pInicio.slice(6, 10),
                      simulacao.pInicio.slice(3, 5),
                      simulacao.pInicio.slice(0, 2),
                      indexHora,
                      indexMin,
                      0).getDate()+indexDia)
                      equip.dateTimeOn = d1.toLocaleString();
                      lab.consumo += equip.potencia / 1000;
                      var consumo1 = 0;
                      consumo1 = lab.consumo;
                      lab.consumo = Number(consumo1.toFixed(2));
                      this.labService.update(lab, lab.key);
                      for (var s1 of simulacao.snapshotLabs) {
                        if (
                          lab.nome === s1.nomeLab &&
                          equip.id === s1.equip.id
                        ) {
                          var achou = s1.equipDateOn.filter(
                            (item) =>
                              item.slice(0, 10) ===
                              equip.dateTimeOn.slice(0, 10)
                          );

                          if (achou) {
                            s1.equipDateOn.forEach((x2) => {
                              if (
                                x2.slice(0, 10) ===
                                equip.dateTimeOn.slice(0, 10)
                              ) {
                                s1.equipDateOn[
                                  s1.equipDateOn.indexOf(x2)
                                ] = equip.dateTimeOn;

                                this.labService.updateSimulacao(
                                  simulacao,
                                  simulacao.key
                                );
                              }
                            });
                          } else {
                            s1.equipDateOn.push(
                              equip.dateTimeOn
                            );
                            this.labService.updateSimulacao(
                              simulacao,
                              simulacao.key
                            );
                          }
                        }
                      }
                    } else if (
                      probabilidade === 0 &&
                      equip.estado === "on"
                    ) {
                      equip.estado = "off";
                      lab.consumo -= equip.potencia / 1000;
                      var consumo2 = 0;
                      consumo2 = lab.consumo;
                      lab.consumo = Number(consumo2.toFixed(2));
                      this.labService.update(lab, lab.key);

                      if (simulacao.estadoSimulacao === true) {
                        var d3 =new Date();
                        d3.setDate(new Date( 
                        simulacao.pInicio.slice(6, 10),
                        simulacao.pInicio.slice(3, 5),
                        simulacao.pInicio.slice(0, 2),
                        indexHora,
                        indexMin,
                        0).getDate()+indexDia)
                       ;
                        var log: Log = {
                          labNome: lab.nome,
                          equipamento: equip,
                          dateTimeOn: equip.dateTimeOn,
                          dateTimeOff: d3.toLocaleString()
                        };

                        simulacao.log.push(log);
                        this.labService.updateSimulacao(
                          simulacao,
                          simulacao.key
                        );
                      }
                    } else if (
                      monteCarlo < probabilidade &&
                      equip.estado === "off" &&
                      probabilidade > 0
                    ) {
                      console.log("equip ligado"+equip)
                      equip.estado = "on";
                      var d2 =new Date();
                      d2.setDate(new Date( 
                      simulacao.pInicio.slice(6, 10),
                      simulacao.pInicio.slice(3, 5),
                      simulacao.pInicio.slice(0, 2),
                      indexHora,
                      indexMin,
                      0).getDate()+indexDia)
                      equip.dateTimeOn = d2.toLocaleString();
                      lab.consumo += equip.potencia / 1000;
                      var consumo3 = 0;
                      consumo3 = lab.consumo;
                      lab.consumo = Number(consumo3.toFixed(2));
                      this.labService.update(lab, lab.key);

                      for (var s of simulacao.snapshotLabs) {
                        if (
                          lab.nome === s.nomeLab &&
                          equip.id === s.equip.id
                        ) {
                          var achou2 = s.equipDateOn.filter(
                            (item) =>
                              item.slice(0, 10) ===
                              equip.dateTimeOn.slice(0, 10)
                          );

                          if (achou2.length > 0) {
                            s.equipDateOn.forEach((x2) => {
                              if (
                                x2.slice(0, 10) ===
                                equip.dateTimeOn.slice(0, 10)
                              ) {
                                s.equipDateOn[
                                  s.equipDateOn.indexOf(x2)
                                ] = equip.dateTimeOn;

                                this.labService.updateSimulacao(
                                  simulacao,
                                  simulacao.key
                                );
                              }
                            });
                          } else {
                            s.equipDateOn.push(
                              equip.dateTimeOn
                            );
                            this.labService.updateSimulacao(
                              simulacao,
                              simulacao.key
                            );
                          }
                        }
                      }
                    } else if (
                      monteCarlo > probabilidade &&
                      equip.estado === "on"
                    ) {
                      console.log("equip desligado"+equip)
                      equip.estado = "off";
                      lab.consumo -= equip.potencia / 1000;
                      var consumo4 = 0;
                      consumo4 = lab.consumo;
                      lab.consumo = Number(consumo4.toFixed(2));
                      this.labService.update(lab, lab.key);

                      if (simulacao.estadoSimulacao === true) {
                        var d4 =new Date();
                        d4.setDate(new Date( 
                        simulacao.pInicio.slice(6, 10),
                        simulacao.pInicio.slice(3, 5),
                        simulacao.pInicio.slice(0, 2),
                        indexHora,
                        indexMin,
                        0).getDate()+indexDia)
                       ;
                        var log2: Log = {
                          labNome: lab.nome,
                          equipamento: equip,
                          dateTimeOn: equip.dateTimeOn,
                          dateTimeOff: d4.toLocaleString()
                        };

                        simulacao.log.push(log2);
                        this.labService.updateSimulacao(
                          simulacao,
                          simulacao.key
                        );
                      }
                    }
                  }
                });
              }
            });
          });
        });
    }
    });
  }
  pausarSimulacao() {
    clearInterval(this.loop);
    clearInterval(this.timer);
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
  dataSimulacao: any;
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
    this.dataSimulacao = data;
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

    var dataInicio = this.dataSimulacao.periodo.inicio.toLocaleDateString(
      "pt-BR",
      {
        timeZone: "UTC"
      }
    );
    var dataFim = this.dataSimulacao.periodo.fim.toLocaleDateString("pt-BR", {
      timeZone: "UTC"
    });
    this.dataInicio = dataInicio;
    this.dataFim = dataFim;
    var dias = Math.abs(
      this.dataSimulacao.periodo.inicio.getDate() -
        this.dataSimulacao.periodo.fim.getDate()
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
            if (this.dataSimulacao.snapshot.snapshot === "snapshotUi") {
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
export class SimuladorComponent implements OnInit, AfterViewInit {
  dadosIniciais: FormGroup;
  tipo: FormGroup;
  periodo: FormGroup;
  modelo: FormGroup;
  snapshot: FormGroup;

  simulacoes: Observable<any>;
  simulacao: Simulacao;

  cols: number;

  panelOpenState = false;

  gridByBreakpoint = {
    xl: 2,
    lg: 2,
    md: 2,
    sm: 1,
    xs: 1
  };
  value: string = "";

  constructor(
    private _formBuilder: FormBuilder,
    private breakpointObserver: BreakpointObserver,
    public dialog: MatDialog,
    private labService: LabService,
    private labDataService: LabDataService
  ) {
    this.simulacoes = this.labService.getAllSimulacoes();
    this.simulacoes.forEach((element) => {
      this.value = "";
      element.forEach((simulacao) => {
        if (simulacao.estadoSimulacao === true) {
          this.simulacao = simulacao;
          simulacao.log.forEach((log) => {
            if (simulacao.log.indexOf(log) === 0) {
              this.value +=
                "Início da simulação: " + log.inicioSimulacao + "\n";
            } else {
              this.value +=
                "Laboratório: " +
                log.labNome +
                " | Equipamento: " +
                log.equipamento.nome +
                " | Id: " +
                log.equipamento.id +
                " | ligado em: " +
                log.dateTimeOn +
                " | Desligado em: " +
                log.dateTimeOff +
                "\n";
            }
          });
        }
      });
    });

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

  ngAfterViewInit() {}
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
    } else if (tipo.tipo === "tReal") {
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
