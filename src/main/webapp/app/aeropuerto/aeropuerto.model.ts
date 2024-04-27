export class AeropuertoDTO {

  constructor(data:Partial<AeropuertoDTO>) {
    Object.assign(this, data);
  }

  id?: number|null;
  nombre?: string|null;
  ciudad?: string|null;
  ciudadAbrev?: string|null;
  pais?: string|null;

}
