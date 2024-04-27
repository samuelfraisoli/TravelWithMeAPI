export class DetallesHotelDTO {

  constructor(data:Partial<DetallesHotelDTO>) {
    Object.assign(this, data);
    if (data.comodidades) {
      this.comodidades = JSON.parse(data.comodidades);
    }
  }

  id?: number|null;
  descripcion?: string|null;
  web?: string|null;
  telefono?: string|null;
  comodidades?: any|null;

}
