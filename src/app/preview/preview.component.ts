import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RequestService } from '../service/request.service';

@Component({
  selector: 'preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.css']
})
export class PreviewComponent {
  constructor(public requestService: RequestService) { }
  @Input() personaGiuridica: boolean = false;
  @Input() objCliente: any;
  strAnteprima: string = '';

  ngOnInit() {
    // Persona giuridica
    if (this.personaGiuridica) {
      this.strAnteprima = this.objCliente.RagioneSociale + ' è una persona giuridica di tipologia ' + this.objCliente.TipologiaPersonaGiuridica;
      if (this.objCliente.NumeroDipendenti == 0) {
        this.strAnteprima += ', non ha dipendenti';
      } else {
        this.strAnteprima += ', ha ' + this.objCliente.NumeroDipendenti + ' dipendenti.';
      }
      this.strAnteprima += 'La sua partita IVA è ' + this.objCliente.PartitaIVA;
      this.strAnteprima += ' e il cap del suo domicilio è ' + this.objCliente.CAP + '. ';
      this.strAnteprima += this.objCliente.RagioneSociale + ' lavora nel settore merceologico:  ' + this.objCliente.SettoreMerceologico;
      this.strAnteprima += ' Il suo proprietario ';
    } else { // Persona NON giuridica
      this.strAnteprima = this.objCliente.Cognome + ' ' + this.objCliente.Nome + ' è una persona non giuridica, il suo codice fiscale è ' + this.objCliente.CodiceFiscale.toUpperCase() + ' e il codice postale del suo domicilio è ' + this.objCliente.CAP + '. ';
      switch (this.objCliente.AnimaliDomestici) {
        case 'Cani/gatti':
          this.strAnteprima += 'Il cliente possiede cani e/o gatti';
          break;
        case 'Altro':
          this.strAnteprima += 'Il cliente possiede animali domestici di tipologia non comune';
          break;
        default:
          this.strAnteprima += 'Il cliente non possiede animali domestici';
          break;
      }
      this.strAnteprima += '. ' + this.objCliente.Nome + ' ';
    }// Dati COMUNI
    if (this.objCliente.NucleoFamigliare.NumeroFamigliari == 1) {
      this.strAnteprima += 'è l\' unica persona nel suo nucleo famigliare';
    } else {
      this.strAnteprima += 'ha un nucleo famigliare composto da ' + this.objCliente.NucleoFamigliare.NumeroFamigliari + ' persone compreso lui, in particolare ci sono:';
      if (this.objCliente.NucleoFamigliare.Genero) {
        this.strAnteprima += ' il genero;';
      }
      if (this.objCliente.NucleoFamigliare.Madre) {
        this.strAnteprima += ' la madre;';
      }
      if (this.objCliente.NucleoFamigliare.Padre) {
        this.strAnteprima += ' il padre;';
      }
      if (this.objCliente.NucleoFamigliare.Figli > 0) {
        this.strAnteprima += ' ' + this.objCliente.NucleoFamigliare.Figli + ' figli';
        if (this.objCliente.NucleoFamigliare.Figli == 1) {
          this.strAnteprima += 'o';
        }
        this.strAnteprima += ';';
      }
    }
    this.strAnteprima += ' inoltre ';
    if (!this.objCliente.ImmobiliDiProprieta) {
      this.strAnteprima += 'non';
    }
    this.strAnteprima += 'possiede immobili di proprietà. ';
    this.strAnteprima += 'Il cliente desidera una copertura assicurativa in ambito ' + this.objCliente.BisogniAssicurativi.AmbitoCopertura + ', ';
    switch (this.objCliente.BisogniAssicurativi.PolizzePreesistenti.length) {
      case 0:
        this.strAnteprima += 'non possiede polizze preesistenti';
        break;
      case 1:
        this.strAnteprima += 'possiede la seguente poliza preesistente: ' + this.objCliente.PolizzePreesistenti;
        break;
      default:
        this.strAnteprima += 'possiede già le seguenti polizze: ' + this.objCliente.BisogniAssicurativi.PolizzePreesistenti;
        break;
    }
    this.strAnteprima += '; gli obbiettivi assicurativi e i soggetti da tutelare secondo le richieste del cliente sono:';
    //Protezione patrimonio
    if (this.objCliente.BisogniAssicurativi.ProtezioneDanniCausati.VitaPersonale || this.objCliente.BisogniAssicurativi.ProtezioneDanniCausati.EsercizioProfessione) {
      this.strAnteprima += ' la protezione del proprio patrimonio per richieste di risarcimento dovute a danni causati a terzi ';
      if (this.objCliente.BisogniAssicurativi.ProtezioneDanniCausati.VitaPersonale) {
        this.strAnteprima += 'nella vita personale';
      }
      if (this.objCliente.BisogniAssicurativi.ProtezioneDanniCausati.VitaPersonale && this.objCliente.BisogniAssicurativi.ProtezioneDanniCausati.EsercizioProfessione) {
        this.strAnteprima += ' e ';
      }
      if (this.objCliente.BisogniAssicurativi.ProtezioneDanniCausati.EsercizioProfessione) {
        this.strAnteprima += 'nell\' esercizio della professione;';
      }
    }
    //Protezione beni
    if (this.objCliente.BisogniAssicurativi.ProtezioneBeni.Propri || this.objCliente.BisogniAssicurativi.ProtezioneBeni.Altrui) {
      this.strAnteprima += ' la protezione dei beni ';
      if (this.objCliente.BisogniAssicurativi.ProtezioneBeni.Propri) {
        this.strAnteprima += 'propri';
      }
      if (this.objCliente.BisogniAssicurativi.ProtezioneBeni.Propri && this.objCliente.BisogniAssicurativi.ProtezioneBeni.Altrui) {
        this.strAnteprima += ' e ';
      }
      if (this.objCliente.BisogniAssicurativi.ProtezioneBeni.Altrui) {
        this.strAnteprima += 'altrui';
      }
      this.strAnteprima += ', nello specifico, protezione da:';
      if (this.objCliente.BisogniAssicurativi.ProtezioneBeni.Specifiche.Danneggiamento) {
        this.strAnteprima += ' danneggiamento;';
      }
      if (this.objCliente.BisogniAssicurativi.ProtezioneBeni.Specifiche.Sottrazione) {
        this.strAnteprima += ' sottrazione;';
      }
      if (this.objCliente.BisogniAssicurativi.ProtezioneBeni.Specifiche.Trasferimento) {
        this.strAnteprima += ' trasferimento o trasporti;';
      }
    }
    // Tutela Legale
    if (this.objCliente.BisogniAssicurativi.TutelaLegale.Professione || this.objCliente.BisogniAssicurativi.TutelaLegale.Famiglia || this.objCliente.BisogniAssicurativi.TutelaLegale.Azienda) {
      this.strAnteprima += ' la tutela legale ';
      if (this.objCliente.BisogniAssicurativi.TutelaLegale.Professione) {
        this.strAnteprima += 'per la propria professione; ';
      }
      if (this.objCliente.BisogniAssicurativi.TutelaLegale.Famiglia) {
        this.strAnteprima += 'per la propria famiglia; ';
      }
      if (this.objCliente.BisogniAssicurativi.TutelaLegale.Azienda) {
        this.strAnteprima += 'per la propria azienda; ';
      }
    }
    // Protezione persona o famigliari
    if (this.objCliente.BisogniAssicurativi.ProtezionePersonale.SeStessi || this.objCliente.BisogniAssicurativi.ProtezionePersonale.Famiglia) {
      this.strAnteprima += ' protezione ';
      if (this.objCliente.BisogniAssicurativi.ProtezionePersonale.SeStessi) {
        this.strAnteprima += 'personale';
      }
      if (this.objCliente.BisogniAssicurativi.ProtezionePersonale.SeStessi && this.objCliente.BisogniAssicurativi.ProtezionePersonale.Famiglia) {
        this.strAnteprima += ' e ';
      }
      if (this.objCliente.BisogniAssicurativi.ProtezionePersonale.Famiglia) {
        this.strAnteprima += 'della propria famiglia';
      }
      this.strAnteprima += ' da: ';
      if (this.objCliente.BisogniAssicurativi.ProtezionePersonale.Specifiche.Infortuni) {
        this.strAnteprima += 'inforturni; ';
      }
      if (this.objCliente.BisogniAssicurativi.ProtezionePersonale.Specifiche.Malattia) {
        this.strAnteprima += 'malattia; ';
      }
      if (this.objCliente.BisogniAssicurativi.ProtezionePersonale.Specifiche.Morte) {
        this.strAnteprima += 'morte; ';
      }
    }
    // Protezione viaggi
    if (this.objCliente.BisogniAssicurativi.ProtezioneViaggi.Viaggi || this.objCliente.BisogniAssicurativi.ProtezioneViaggi.Conducente || this.objCliente.BisogniAssicurativi.ProtezioneViaggi.Circolazione) {
      this.strAnteprima+=' protezione durante i viaggi da:'
      if(this.objCliente.BisogniAssicurativi.ProtezioneViaggi.Viaggi){
        this.strAnteprima+=' annullamento, perdita bagagli, infortuni, assistenza sanitaria, ect;'
      }
      if(this.objCliente.BisogniAssicurativi.ProtezioneViaggi.Conducente){
        this.strAnteprima+=' conducente;'
      }
      if(this.objCliente.BisogniAssicurativi.ProtezioneViaggi.Viaggi){
        this.strAnteprima+=' circolazione;'
      }
    }
  }

  reset(){
    location.reload()
  }

  async submit(){
    await this.requestService.postCliente(this.objCliente)
    location.reload()
  }

}
