import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'needs',
  templateUrl: './needs.component.html',
  styleUrls: ['./needs.component.css']
})
export class NeedsComponent {
  @Input() personaGiuridica: boolean = false;
  @Output() controlloInserimento = new EventEmitter();
  @Output() datiOk = new EventEmitter();
  objRisultato: any = {
    AmbitoCopertura: 'Ignoto',
    ProtezioneDanniCausati: {
      VitaPersonale: false,
      EsercizioProfessione: false
    },
    ProtezioneBeni: {
      Propri: false,
      Altrui: false,
      Specifiche: {
        Danneggiamento: false,
        Sottrazione: false,
        Trasferimento: false
      }
    },
    TutelaLegale: {
      Professione: false,
      Famiglia: false,
      Azienda: false
    },
    ProtezionePersonale: {
      SeStessi: false,
      Famiglia: false,
      Specifiche: {
        Infortuni: false,
        Malattie: false,
        Morte: false
      }
    },
    ProtezioneViaggi: {
      Viaggi: false,
      Conducente: false,
      Circolazione: false
    }
  };
  arrPolizze: string[] = ["Responsabilità Civile", 'Infortuni', 'Malattie', 'Incendio', 'Furto', 'Cauzioni', 'Previdenza', 'Multi rischi in Genere', 'Tutela Legale', 'Trasporti', 'Auto'];
  altraPolizza: boolean = false;
  polizzaAgg: string = '';
  polizzeSelezionate: string[] = [];
  ambCop: string = 'Ignoto';
  protBeni: boolean = false;
  protProp: boolean = false;

  ctrlInput(e: any) {
    this.controlloInserimento.emit(e);
  }

  clickPolizza(polizza: string) {
    const index = this.polizzeSelezionate.indexOf(polizza);
    if (index > -1) {
      this.polizzeSelezionate.splice(index, 1);
    } else {
      this.polizzeSelezionate.push(polizza);
    }
  }

  almenoUnProt() {
    if (this.objRisultato.ProtezioneBeni.Propri || this.objRisultato.ProtezioneBeni.Altrui) {
      this.protBeni = true;
    } else {
      this.protBeni = false;
    }

    if (this.objRisultato.ProtezionePersonale.SeStessi || this.objRisultato.ProtezionePersonale.Famiglia) {
      this.protProp = true;
    } else {
      this.protProp = false;
    }
  }

  controllo() {
    if (this.altraPolizza) {
      if (this.polizzaAgg == '') {
        document.querySelector('#altraPolizza')?.classList.add('error');
        this.datiOk.emit({ messaggio: "Polizza aggiuntiva non inserita", esito: false });
        return;
      }
      this.polizzeSelezionate.push(this.polizzaAgg);
    }
    this.objRisultato.PolizzePreesistenti = this.polizzeSelezionate;
    if (this.protBeni && !this.objRisultato.ProtezioneBeni.Specifiche.Danneggiamento && !this.objRisultato.ProtezioneBeni.Specifiche.Sottrazione && !this.objRisultato.ProtezioneBeni.Specifiche.Trasferimento) {
      document.querySelector('#specProtBeni')?.classList.add('error');
      this.datiOk.emit({ messaggio: "Non viene specificata la specifica protezione dei beni richiesta", esito: false });
      return;
    }
    if (this.protProp && !this.objRisultato.ProtezionePersonale.Specifiche.Infortuni && !this.objRisultato.ProtezionePersonale.Specifiche.Malattie && !this.objRisultato.ProtezionePersonale.Specifiche.Morte) {
      document.querySelector('#specProtProp')?.classList.add('error');
      this.datiOk.emit({ messaggio: "Non viene specificata la specifica protezione personale richiesta", esito: false });
      return;
    }
    console.log(this.objRisultato);
    this.datiOk.emit({ messaggio: 'needs OK', esito: true });
  }
}
