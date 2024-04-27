import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { InputRowComponent } from 'app/common/input-row/input-row.component';
import { TrayectoVueloService } from 'app/trayecto-vuelo/trayecto-vuelo.service';
import { TrayectoVueloDTO } from 'app/trayecto-vuelo/trayecto-vuelo.model';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { validOffsetDateTime } from 'app/common/utils';


@Component({
  selector: 'app-trayecto-vuelo-add',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, InputRowComponent],
  templateUrl: './trayecto-vuelo-add.component.html'
})
export class TrayectoVueloAddComponent implements OnInit {

  trayectoVueloService = inject(TrayectoVueloService);
  router = inject(Router);
  errorHandler = inject(ErrorHandler);

  vueloValues?: Map<number,string>;
  origenValues?: Map<number,string>;
  destinoValues?: Map<number,string>;

  addForm = new FormGroup({
    idTrayecto: new FormControl(null, [Validators.required, Validators.maxLength(255)]),
    aerolinea: new FormControl(null, [Validators.required, Validators.maxLength(255)]),
    tipo: new FormControl(null, [Validators.maxLength(255)]),
    fechaSalida: new FormControl(null, [Validators.required, validOffsetDateTime]),
    fechaLlegada: new FormControl(null, [Validators.required, validOffsetDateTime]),
    escala: new FormControl(false),
    fechaInicioEscala: new FormControl(null, [Validators.required, validOffsetDateTime]),
    fechaFinEscala: new FormControl(null, [Validators.required, validOffsetDateTime]),
    terminalSalida: new FormControl(null, [Validators.maxLength(255)]),
    terminalLlegada: new FormControl(null, [Validators.maxLength(255)]),
    vuelo: new FormControl(null, [Validators.required]),
    origen: new FormControl(null, [Validators.required]),
    destino: new FormControl(null, [Validators.required])
  }, { updateOn: 'submit' });

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      created: $localize`:@@trayectoVuelo.create.success:Trayecto Vuelo was created successfully.`,
      TRAYECTO_VUELO_ORIGEN_UNIQUE: $localize`:@@Exists.trayectoVuelo.origen:This Aeropuerto is already referenced by another Trayecto Vuelo.`
    };
    return messages[key];
  }

  ngOnInit() {
    this.trayectoVueloService.getVueloValues()
        .subscribe({
          next: (data) => this.vueloValues = data,
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
    this.trayectoVueloService.getOrigenValues()
        .subscribe({
          next: (data) => this.origenValues = data,
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
    this.trayectoVueloService.getDestinoValues()
        .subscribe({
          next: (data) => this.destinoValues = data,
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
  }

  handleSubmit() {
    window.scrollTo(0, 0);
    this.addForm.markAllAsTouched();
    if (!this.addForm.valid) {
      return;
    }
    const data = new TrayectoVueloDTO(this.addForm.value);
    this.trayectoVueloService.createTrayectoVuelo(data)
        .subscribe({
          next: () => this.router.navigate(['/trayectoVuelos'], {
            state: {
              msgSuccess: this.getMessage('created')
            }
          }),
          error: (error) => this.errorHandler.handleServerError(error.error, this.addForm, this.getMessage)
        });
  }

}
