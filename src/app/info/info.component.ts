import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css']
})
export class InfoComponent {
  @Input() personaGiuridica: boolean = false;
  @Output() controlloInserimento = new EventEmitter();
  @Output() datiOk = new EventEmitter();
  objPersona: any = {};
  objAzienda: any = {};
  figli: boolean = false;
  numeroFigli: number = 1;
  nucleoFamigliare: any = {
    NumeroFamigliari: 1,
    Genero: false,
    Figli: 0,
    Padre: false,
    Madre: false
  };
  possImmobili: string = 'No';
  possAniDom: string = 'No';
  settMerc:string=''

  ctrlInput(e: any) {
    this.controlloInserimento.emit(e);
  }

  modificaFamiglia(e: any) {
    console.log(e.target.checked);
    if (!e.target.checked) {
      this.nucleoFamigliare.NumeroFamigliari--;
      return;
    }
    this.nucleoFamigliare.NumeroFamigliari++;
    if (e.target.value == 'c') {
      this.nucleoFamigliare.Genero = !this.nucleoFamigliare.Genero;
    }
    if (e.target.value == 'p') {
      this.nucleoFamigliare.Padre = !this.nucleoFamigliare.Padre;
    }
    if (e.target.value == 'm') {
      this.nucleoFamigliare.Madre = !this.nucleoFamigliare.Madre;
    }
    console.log(this.nucleoFamigliare.NumeroFamigliari);

  }

  async controllo() {
    if (this.figli) {
      if (this.numeroFigli == 0) {
        document.querySelector('#numFigli')?.classList.add('error');
        this.datiOk.emit({ messaggio: "Numero dei figli non inserito", esito: false });
        return;
      }
      this.nucleoFamigliare.Figli = this.numeroFigli;
    } else {
      this.numeroFigli--;
    }
    if(this.nucleoFamigliare.Genero){
      this.nucleoFamigliare.NumeroFamigliari++
    }
    if(this.nucleoFamigliare.Padre){
      this.nucleoFamigliare.NumeroFamigliari++
    }
    if(this.nucleoFamigliare.Madre){
      this.nucleoFamigliare.NumeroFamigliari++
    }
    
    if (this.personaGiuridica) { //CONTROLLO PERSONA GIURIDICA
      if(this.settMerc==''){
        document.querySelector('#sett')?.classList.add('error')
        this.datiOk.emit({ messaggio: "Settore Merceologico non inserito", esito: false });
        return;
      }
      this.objAzienda={
        NucleoFamigliare: this.nucleoFamigliare,
        SettoreMerceologico: this.settMerc,
        ImmobiliDiProprieta:this.possImmobili
      }
    } else {
      this.objPersona={
        NucleoFamigliare: this.nucleoFamigliare,
        ImmobiliDiProprieta:this.possImmobili,
        AnimaliDomestici:this.possAniDom
      }
      console.log(this.objPersona)
    }
    this.datiOk.emit({ messaggio: 'info OK', esito: true });
  }
}
