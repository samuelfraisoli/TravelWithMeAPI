import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { DetallesHotelDTO } from 'app/detalles-hotel/detalles-hotel.model';


@Injectable({
  providedIn: 'root',
})
export class DetallesHotelService {

  http = inject(HttpClient);
  resourcePath = environment.apiPath + '/api/detallesHotels';

  getAllDetallesHotels() {
    return this.http.get<DetallesHotelDTO[]>(this.resourcePath);
  }

  getDetallesHotel(id: number) {
    return this.http.get<DetallesHotelDTO>(this.resourcePath + '/' + id);
  }

  createDetallesHotel(detallesHotelDTO: DetallesHotelDTO) {
    return this.http.post<number>(this.resourcePath, detallesHotelDTO);
  }

  updateDetallesHotel(id: number, detallesHotelDTO: DetallesHotelDTO) {
    return this.http.put<number>(this.resourcePath + '/' + id, detallesHotelDTO);
  }

  deleteDetallesHotel(id: number) {
    return this.http.delete(this.resourcePath + '/' + id);
  }

}
