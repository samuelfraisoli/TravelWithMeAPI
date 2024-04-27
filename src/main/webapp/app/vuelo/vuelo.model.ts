export class VueloDTO {

  constructor(data:Partial<VueloDTO>) {
    Object.assign(this, data);
  }

  id?: number|null;
  idVuelo?: string|null;
  aerolinea?: string|null;
  precio?: number|null;
  tipo?: string|null;
  origen?: string|null;
  destino?: string|null;
  fecha?: string|null;
  equipaje?: number|null;

}
