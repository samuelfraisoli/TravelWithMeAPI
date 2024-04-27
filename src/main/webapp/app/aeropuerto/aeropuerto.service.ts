import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { AeropuertoDTO } from 'app/aeropuerto/aeropuerto.model';


@Injectable({
  providedIn: 'root',
})
export class AeropuertoService {

  http = inject(HttpClient);
  resourcePath = environment.apiPath + '/api/aeropuertos';

  getAllAeropuertoes() {
    return this.http.get<AeropuertoDTO[]>(this.resourcePath);
  }

  getAeropuerto(id: number) {
    return this.http.get<AeropuertoDTO>(this.resourcePath + '/' + id);
  }

  createAeropuerto(aeropuertoDTO: AeropuertoDTO) {
    return this.http.post<number>(this.resourcePath, aeropuertoDTO);
  }

  updateAeropuerto(id: number, aeropuertoDTO: AeropuertoDTO) {
    return this.http.put<number>(this.resourcePath + '/' + id, aeropuertoDTO);
  }

  deleteAeropuerto(id: number) {
    return this.http.delete(this.resourcePath + '/' + id);
  }

}
