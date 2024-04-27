import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { DireccionDTO } from 'app/direccion/direccion.model';


@Injectable({
  providedIn: 'root',
})
export class DireccionService {

  http = inject(HttpClient);
  resourcePath = environment.apiPath + '/api/direccions';

  getAllDireccions() {
    return this.http.get<DireccionDTO[]>(this.resourcePath);
  }

  getDireccion(id: number) {
    return this.http.get<DireccionDTO>(this.resourcePath + '/' + id);
  }

  createDireccion(direccionDTO: DireccionDTO) {
    return this.http.post<number>(this.resourcePath, direccionDTO);
  }

  updateDireccion(id: number, direccionDTO: DireccionDTO) {
    return this.http.put<number>(this.resourcePath + '/' + id, direccionDTO);
  }

  deleteDireccion(id: number) {
    return this.http.delete(this.resourcePath + '/' + id);
  }

}
