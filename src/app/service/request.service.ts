import { Injectable } from '@angular/core';
import { ConnectionService } from './connection.service';

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  constructor(private connectionService: ConnectionService) { }

  dataComune: any;
  response:any

  async getComune(infoComune: any) {
    try {
      const serverData: any = await this.connectionService.sendPostRequest('/api/getComune', infoComune).toPromise();
      this.dataComune = serverData.data;
    } catch (error) {
      console.log("errore GET Comune");
      console.log(error);
    }
  }

  async postCliente(obj:any){
    try {
      const serverData: any = await this.connectionService.sendPostRequest('/api/postCliente', obj).toPromise();
      this.dataComune = serverData.data;
    } catch (error) {
      console.log("errore GET Comune");
      console.log(error);
    }
  }
}
