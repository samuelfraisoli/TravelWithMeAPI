export class HotelDTO {

  constructor(data:Partial<HotelDTO>) {
    Object.assign(this, data);
    if (data.fotos) {
      this.fotos = JSON.parse(data.fotos);
    }
    if (data.fechasLibres) {
      this.fechasLibres = JSON.parse(data.fechasLibres);
    }
  }

  id?: number|null;
  nombre?: string|null;
  fotos?: any|null;
  fechasLibres?: any|null;
  direccion?: number|null;
  detallesHotel?: number|null;

}
