export class ResenaDTO {

  constructor(data:Partial<ResenaDTO>) {
    Object.assign(this, data);
  }

  id?: number|null;
  idUsuario?: string|null;
  fecha?: string|null;
  titulo?: string|null;
  contenido?: string|null;
  nota?: number|null;
  hotel?: number|null;

}
