export class TrayectoVueloDTO {

  constructor(data:Partial<TrayectoVueloDTO>) {
    Object.assign(this, data);
  }

  id?: number|null;
  idTrayecto?: string|null;
  aerolinea?: string|null;
  tipo?: string|null;
  fechaSalida?: string|null;
  fechaLlegada?: string|null;
  escala?: boolean|null;
  fechaInicioEscala?: string|null;
  fechaFinEscala?: string|null;
  terminalSalida?: string|null;
  terminalLlegada?: string|null;
  vuelo?: number|null;
  origen?: number|null;
  destino?: number|null;

}
