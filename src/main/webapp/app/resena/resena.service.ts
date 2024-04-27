import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { ResenaDTO } from 'app/resena/resena.model';
import { map } from 'rxjs';
import { transformRecordToMap } from 'app/common/utils';


@Injectable({
  providedIn: 'root',
})
export class ResenaService {

  http = inject(HttpClient);
  resourcePath = environment.apiPath + '/api/resenas';

  getAllResenas() {
    return this.http.get<ResenaDTO[]>(this.resourcePath);
  }

  getResena(id: number) {
    return this.http.get<ResenaDTO>(this.resourcePath + '/' + id);
  }

  createResena(resenaDTO: ResenaDTO) {
    return this.http.post<number>(this.resourcePath, resenaDTO);
  }

  updateResena(id: number, resenaDTO: ResenaDTO) {
    return this.http.put<number>(this.resourcePath + '/' + id, resenaDTO);
  }

  deleteResena(id: number) {
    return this.http.delete(this.resourcePath + '/' + id);
  }

  getHotelValues() {
    return this.http.get<Record<string,string>>(this.resourcePath + '/hotelValues')
        .pipe(map(transformRecordToMap));
  }

}
