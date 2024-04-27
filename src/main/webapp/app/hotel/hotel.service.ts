import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { HotelDTO } from 'app/hotel/hotel.model';
import { map } from 'rxjs';
import { transformRecordToMap } from 'app/common/utils';


@Injectable({
  providedIn: 'root',
})
export class HotelService {

  http = inject(HttpClient);
  resourcePath = environment.apiPath + '/api/hotels';

  getAllHotels() {
    return this.http.get<HotelDTO[]>(this.resourcePath);
  }

  getHotel(id: number) {
    return this.http.get<HotelDTO>(this.resourcePath + '/' + id);
  }

  createHotel(hotelDTO: HotelDTO) {
    return this.http.post<number>(this.resourcePath, hotelDTO);
  }

  updateHotel(id: number, hotelDTO: HotelDTO) {
    return this.http.put<number>(this.resourcePath + '/' + id, hotelDTO);
  }

  deleteHotel(id: number) {
    return this.http.delete(this.resourcePath + '/' + id);
  }

  getDireccionValues() {
    return this.http.get<Record<string,string>>(this.resourcePath + '/direccionValues')
        .pipe(map(transformRecordToMap));
  }

  getDetallesHotelValues() {
    return this.http.get<Record<string,number>>(this.resourcePath + '/detallesHotelValues')
        .pipe(map(transformRecordToMap));
  }

}
