import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RequestService } from '../service/request.service';

@Component({
  selector: 'id-data',
  templateUrl: './id-data.component.html',
  styleUrls: ['./id-data.component.css']
})
export class IdDataComponent {
  constructor(public requestService: RequestService) { }
  @Input() personaGiuridica: boolean = false;
  @Output() controlloInserimento = new EventEmitter();
  @Output() datiOk = new EventEmitter();
  cfAssente: boolean = false;
  objPersona: any = {};
  objAzienda: any = {};
  luogoNascita: string = '';
  dataNascita: Date = new Date;
  cognomeNome: string = '';
  ragSoc: string = '';
  arrNomi: string[] = [];
  codiceFiscale: string = '';
  sesso: string = '';
  cap: string = '';
  pIva: string = '';

  ctrlInput(e: any) {
    this.controlloInserimento.emit(e);
  }

  async controllo() {
    if (this.personaGiuridica) { // PERSONA GIURIDICA
      if (this.ragSoc == '') {
        document.querySelector('#ragSoc')?.classList.add('error');
        this.datiOk.emit({ messaggio: "Ragione Sociale non inserita", esito: false });
        return;
      }
      this.objAzienda.RagioneSociale = this.ragSoc;

      if (!this.isValidPartitaIVA(this.pIva) || document.querySelector('#piva')?.classList.contains('error') || this.pIva == '') {
        document.querySelector('#piva')?.classList.add('error');
        this.datiOk.emit({ messaggio: "Partita Iva incorretta o non inserita", esito: false });
        return;
      }

      if (this.cap == '') {
        document.querySelector('#cap')?.classList.add('error');
        this.datiOk.emit({ messaggio: "CAP del domicilio non inserito o incorretto", esito: false });
        return;
      }
      await this.requestService.getComune({ cap: this.cap });
      if (!this.requestService.dataComune) {
        this.datiOk.emit({ messaggio: "CAP incorretto", esito: false });
      }
      this.objPersona.CAP = this.cap;

    } else { // PERSONA NORMALE
      if (this.cognomeNome == '' || this.cognomeNome.split(' ')[1] == null) {
        document.querySelector('#nome')?.classList.add('error');
        this.datiOk.emit({ messaggio: "cognome e nome incorretti o non inseriti", esito: false });
        return;
      }
      console.log(this.cognomeNome.split(' ')[1]);
      this.arrNomi = this.cognomeNome.split(' ');
      this.objPersona.Cognome = this.arrNomi[0];
      this.objPersona.Nome = this.arrNomi.slice(1).join(' ');
      console.log(this.objPersona);

      if (this.cfAssente) {
        delete this.objPersona.CodiceFiscale;
        if (this.dataNascita == null) {
          document.querySelector('#data')?.classList.add('error');
          this.datiOk.emit({ messaggio: "data di nascita non inserita o incorretta", esito: false });
          return;
        }
        if (this.luogoNascita == '') {
          document.querySelector('#luogo')?.classList.add('error');
          this.datiOk.emit({ messaggio: "luogo di nascita non inserito o incorretto", esito: false });
          return;
        }
        if (this.sesso == '') {
          document.querySelector('#sesso')?.classList.add('error');
          this.datiOk.emit({ messaggio: "sesso non inserito o incorretto", esito: false });
          return;
        }

        this.dataNascita = new Date(this.dataNascita);

        this.objPersona.CodiceFiscale = await this.generaCodiceFiscale(this.sesso, this.objPersona.Nome, this.objPersona.Cognome, this.dataNascita, this.luogoNascita);
        console.log('cf: ' + this.objPersona.CodiceFiscale);

        if (this.objPersona.CodiceFiscale == 'no') {
          document.querySelector('#luogo')?.classList.add('error');
          this.datiOk.emit({ messaggio: "città di nascita incorretta", esito: false });
          return;
        }

      } else {
        delete this.objPersona.DataNascita;
        delete this.objPersona.LuogoNascita;
        if (document.querySelector('#cf')?.classList.contains('error') || this.codiceFiscale == '') {
          document.querySelector('#cf')?.classList.add('error');
          this.datiOk.emit({ messaggio: "codice fiscale non inserito o incorretto", esito: false });
          return;
        }
        this.objPersona.CodiceFiscale = this.codiceFiscale;
      }

      if (this.cap == '') {
        document.querySelector('#cap')?.classList.add('error');
        this.datiOk.emit({ messaggio: "CAP del domicilio non inserito o incorretto", esito: false });
        return;
      }
      await this.requestService.getComune({ cap: this.cap });
      if (!this.requestService.dataComune) {
        this.datiOk.emit({ messaggio: "CAP incorretto", esito: false });
      }
      this.objPersona.CAP = this.cap;
    }
    this.datiOk.emit({ messaggio: 'id-data OK', esito: true });
  }

  async generaCodiceFiscale(sesso: string, nome: string, cognome: string, dataNascita: Date, luogoNascita: string): Promise<string> {
    const mesiCodiceFiscale: Record<string, string> = {
      '01': 'A', '02': 'B', '03': 'C', '04': 'D', '05': 'E', '06': 'H',
      '07': 'L', '08': 'M', '09': 'P', '10': 'R', '11': 'S', '12': 'T'
    };

    const vocali = ['A', 'E', 'I', 'O', 'U'];
    const consonanti = 'BCDFGHJKLMNPQRSTVWXYZ';

    const getCognomeCodiceFiscale = (cognome: string): string => {
      let codiceCognome = '';
      let consonantiCognome = '';
      let vocaliCognome = '';

      for (const carattere of cognome.toUpperCase()) {
        if (consonanti.includes(carattere)) {
          consonantiCognome += carattere;
        } else if (vocali.includes(carattere)) {
          vocaliCognome += carattere;
        }
      }

      if (consonantiCognome.length >= 3) {
        codiceCognome = consonantiCognome.slice(0, 3);
      } else if (consonantiCognome.length === 2) {
        codiceCognome = consonantiCognome + vocaliCognome.slice(0, 1);
      } else if (consonantiCognome.length === 1) {
        codiceCognome = consonantiCognome + vocaliCognome.slice(0, 2);
      } else if (consonantiCognome.length === 0) {
        codiceCognome = vocaliCognome.slice(0, 3);
      }

      return codiceCognome;
    };

    const getNomeCodiceFiscale = (nome: string): string => {
      let codiceNome = '';
      let consonantiNome = '';
      let vocaliNome = '';

      for (const carattere of nome.toUpperCase()) {
        if (consonanti.includes(carattere)) {
          consonantiNome += carattere;
        } else if (vocali.includes(carattere)) {
          vocaliNome += carattere;
        }
      }

      if (consonantiNome.length >= 4) {
        codiceNome = consonantiNome[0] + consonantiNome[2] + consonantiNome[3];
      } else if (consonantiNome.length === 3) {
        codiceNome = consonantiNome + vocaliNome.slice(0, 1);
      } else if (consonantiNome.length === 2) {
        codiceNome = consonantiNome + vocaliNome.slice(0, 2);
      } else if (consonantiNome.length === 1) {
        codiceNome = consonantiNome + vocaliNome.slice(0, 2) + 'X';
      } else if (consonantiNome.length === 0) {
        codiceNome = vocaliNome.slice(0, 3) + 'X';
      }

      return codiceNome;
    };

    const getDataCodiceFiscale = (dataNascita: Date, sesso: string): string => {
      const anno = dataNascita.getFullYear().toString().slice(-2);
      const mese = (dataNascita.getMonth() + 1).toString().padStart(2, '0');
      const giorno = dataNascita.getDate().toString().padStart(2, '0');

      let codiceData = anno + mesiCodiceFiscale[mese] + giorno;

      if (sesso === 'F') {
        const giornoFemmina = parseInt(giorno) + 40;
        codiceData = anno + mesiCodiceFiscale[mese] + giornoFemmina.toString();
      }

      return codiceData;
    };

    const codiceCognome = getCognomeCodiceFiscale(cognome);
    const codiceNome = getNomeCodiceFiscale(nome);
    const codiceData = getDataCodiceFiscale(dataNascita, sesso);
    luogoNascita = luogoNascita[0].toUpperCase() + luogoNascita.slice(1);
    await this.requestService.getComune({ nome: luogoNascita });

    if (!this.requestService.dataComune) {
      return 'no';
    }

    let codiceFiscale = codiceCognome + codiceNome + codiceData + this.requestService.dataComune.codiceCatastale;

    codiceFiscale += this.calculateCodiceControllo(codiceFiscale.toString());

    return codiceFiscale;
  }

  calculateCodiceControllo(codiceFiscale: string): string {
    const controlCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const oddMap: { [key: string]: number; } = {
      '0': 1, '1': 0, '2': 5, '3': 7, '4': 9, '5': 13, '6': 15, '7': 17, '8': 19, '9': 21,
      'A': 1, 'B': 0, 'C': 5, 'D': 7, 'E': 9, 'F': 13, 'G': 15, 'H': 17, 'I': 19, 'J': 21,
      'K': 2, 'L': 4, 'M': 18, 'N': 20, 'O': 11, 'P': 3, 'Q': 6, 'R': 8, 'S': 12, 'T': 14,
      'U': 16, 'V': 10, 'W': 22, 'X': 25, 'Y': 24, 'Z': 23
    };

    const evenMap: { [key: string]: number; } = {
      '0': 0, '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9,
      'A': 0, 'B': 1, 'C': 2, 'D': 3, 'E': 4, 'F': 5, 'G': 6, 'H': 7, 'I': 8, 'J': 9,
      'K': 10, 'L': 11, 'M': 12, 'N': 13, 'O': 14, 'P': 15, 'Q': 16, 'R': 17, 'S': 18, 'T': 19,
      'U': 20, 'V': 21, 'W': 22, 'X': 23, 'Y': 24, 'Z': 25
    };

    let sum = 0;

    for (let i = 0; i < 15; i++) {
      const char = codiceFiscale.charAt(i);
      if ((i + 1) % 2 != 0) {
        sum += oddMap[char];
      } else {
        sum += evenMap[char];
      }
    }

    const controlCodeIndex = sum % 26;

    return controlCharacters.charAt(controlCodeIndex);
  }

  isValidPartitaIVA(partitaIVA: string): boolean {
    const codiceControllo = parseInt(partitaIVA[partitaIVA.length - 1]);
    const digits = partitaIVA.substr(0, partitaIVA.length - 1).split('').map(Number);

    console.log(partitaIVA);

    let sum = 0;
    for (let i = 0; i < digits.length; i++) {
      let digit = digits[i];
      if ((i + 1) % 2 === 0) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }
      console.log(digit);
      sum += digit;
    }

    let controlCode = 10 - (sum % 10);

    if (controlCode == 10) {
      controlCode = 0;
    }

    console.log('controlCode: ' + controlCode);
    console.log('codiceControllo: ' + codiceControllo);
    console.log(typeof codiceControllo);


    return controlCode === codiceControllo;
  }

}
