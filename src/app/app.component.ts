import { Component, ViewChild } from '@angular/core';
import { IdDataComponent } from './id-data/id-data.component';
import { InfoComponent } from './info/info.component';
import { NeedsComponent } from './needs/needs.component';
import { RequestService } from './service/request.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(public requestService: RequestService) { }
  @ViewChild(IdDataComponent) idData: IdDataComponent = new IdDataComponent(this.requestService);
  @ViewChild(InfoComponent) info: InfoComponent = new InfoComponent;
  @ViewChild(NeedsComponent) needs: NeedsComponent = new NeedsComponent;
  title = 'ValutazioneRichieste';
  errore: boolean = false;
  personaGiuridica: boolean = false;
  tipologia: any = '0';
  selected: boolean = false;
  txtNome: string = '';
  objPersona: any = {};
  objAzienda: any = {};
  objFinale: any = {};
  numDipendenti: number = 0;
  tuttoOk: boolean = false;

  controlloInserimento(e: any) {
    if (e.target.value == '' || e.target.value == null || !e.target.validity.valid) {
      e.target.classList.add('error');
    } else {
      e.target.classList.remove('error');
    }
  }

  salvataggioDati() {
    if (this.personaGiuridica) {
      this.objAzienda = { ...this.objAzienda, ...this.idData.objAzienda };
    } else {
      this.objPersona = { ...this.objPersona, ...this.idData.objPersona };
    }

    console.log(this.objPersona);

  }

  async controlloDati() {
    this.errore = false;
    if (this.personaGiuridica) {
      console.log(this.tipologia);

      if (this.tipologia == '0' || this.tipologia == '') {
        document.querySelector('#tipologia')?.classList.add('error');
        this.errore = true;
        this.AlertErrore("Tipologia di persona giuridica non inserita");
      }

      if (this.numDipendenti == null) {
        document.querySelector('#numDip')?.classList.add('error');
        this.errore = true;
        this.AlertErrore("Numero dipendenti non inserito");
      }

    }

    if (!this.errore)
      await this.idData.controllo();
    if (!this.errore)
      this.info.controllo();
    if (!this.errore)
      this.needs.controllo();

    if (!this.errore) {
      if (this.personaGiuridica) {
        this.objAzienda = { ...this.objAzienda, ...this.idData.objAzienda, ...this.info.objAzienda, BisogniAssicurativi: this.needs.objRisultato };
        this.objAzienda.PersonaGiuridica = this.personaGiuridica;
        this.objAzienda.TipologiaPersonaGiuridica = this.tipologia;
        this.objAzienda.NumeroDipendenti = this.numDipendenti;
        console.log(this.objAzienda);
        this.objFinale = this.objAzienda;
      } else {
        this.objPersona = { ...this.objPersona, ...this.idData.objPersona, ...this.info.objPersona, BisogniAssicurativi: this.needs.objRisultato };
        this.objPersona.PersonaGiuridica = this.personaGiuridica;
        console.log(this.objPersona);
        this.objFinale = this.objPersona;
      }
      this.tuttoOk=true
    }
  }

  AlertErrore(messaggio: string) {
    alert("ATTENZIONE: " + messaggio);
  }

  controlloFinito(jsonEsito: any) {
    console.log(jsonEsito);
    if (!jsonEsito.esito) {
      this.errore = !jsonEsito.esito;
      this.AlertErrore(jsonEsito.messaggio);
    } else {
      console.log('ok');

    }

  }

}
