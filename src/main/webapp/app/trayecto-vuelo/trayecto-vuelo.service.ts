import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { TrayectoVueloDTO } from 'app/trayecto-vuelo/trayecto-vuelo.model';
import { map } from 'rxjs';
import { transformRecordToMap } from 'app/common/utils';


@Injectable({
  providedIn: 'root',
})
export class TrayectoVueloService {

  http = inject(HttpClient);
  resourcePath = environment.apiPath + '/api/trayectoVuelos';

  getAllTrayectoVueloes() {
    return this.http.get<TrayectoVueloDTO[]>(this.resourcePath);
  }

  getTrayectoVuelo(id: number) {
    return this.http.get<TrayectoVueloDTO>(this.resourcePath + '/' + id);
  }

  createTrayectoVuelo(trayectoVueloDTO: TrayectoVueloDTO) {
    return this.http.post<number>(this.resourcePath, trayectoVueloDTO);
  }

  updateTrayectoVuelo(id: number, trayectoVueloDTO: TrayectoVueloDTO) {
    return this.http.put<number>(this.resourcePath + '/' + id, trayectoVueloDTO);
  }

  deleteTrayectoVuelo(id: number) {
    return this.http.delete(this.resourcePath + '/' + id);
  }

  getVueloValues() {
    return this.http.get<Record<string,string>>(this.resourcePath + '/vueloValues')
        .pipe(map(transformRecordToMap));
  }

  getOrigenValues() {
    return this.http.get<Record<string,string>>(this.resourcePath + '/origenValues')
        .pipe(map(transformRecordToMap));
  }

  getDestinoValues() {
    return this.http.get<Record<string,string>>(this.resourcePath + '/destinoValues')
        .pipe(map(transformRecordToMap));
  }

}
