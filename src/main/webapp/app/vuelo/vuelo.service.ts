import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { VueloDTO } from 'app/vuelo/vuelo.model';
import { map } from 'rxjs';
import { transformRecordToMap } from 'app/common/utils';


@Injectable({
  providedIn: 'root',
})
export class VueloService {

  http = inject(HttpClient);
  resourcePath = environment.apiPath + '/api/vuelos';

  getAllVueloes() {
    return this.http.get<VueloDTO[]>(this.resourcePath);
  }

  getVuelo(id: number) {
    return this.http.get<VueloDTO>(this.resourcePath + '/' + id);
  }

  createVuelo(vueloDTO: VueloDTO) {
    return this.http.post<number>(this.resourcePath, vueloDTO);
  }

  updateVuelo(id: number, vueloDTO: VueloDTO) {
    return this.http.put<number>(this.resourcePath + '/' + id, vueloDTO);
  }

  deleteVuelo(id: number) {
    return this.http.delete(this.resourcePath + '/' + id);
  }

  getEquipajeValues() {
    return this.http.get<Record<string,number>>(this.resourcePath + '/equipajeValues')
        .pipe(map(transformRecordToMap));
  }

}
