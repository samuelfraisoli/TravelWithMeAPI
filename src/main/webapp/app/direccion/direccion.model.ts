export class DireccionDTO {

  constructor(data:Partial<DireccionDTO>) {
    Object.assign(this, data);
  }

  id?: number|null;
  direccionString?: string|null;
  direccion1?: string|null;
  direccion2?: string|null;
  ciudad?: string|null;
  pais?: string|null;
  codPostal?: string|null;

}
