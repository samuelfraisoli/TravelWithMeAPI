import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { InputRowComponent } from 'app/common/input-row/input-row.component';
import { TrayectoVueloService } from 'app/trayecto-vuelo/trayecto-vuelo.service';
import { TrayectoVueloDTO } from 'app/trayecto-vuelo/trayecto-vuelo.model';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { updateForm, validOffsetDateTime } from 'app/common/utils';


@Component({
  selector: 'app-trayecto-vuelo-edit',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, InputRowComponent],
  templateUrl: './trayecto-vuelo-edit.component.html'
})
export class TrayectoVueloEditComponent implements OnInit {

  trayectoVueloService = inject(TrayectoVueloService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  errorHandler = inject(ErrorHandler);

  checkBoxEscalaIsChecked = false;

  vueloValues?: Map<number,string>;
  origenValues?: Map<number,string>;
  destinoValues?: Map<number,string>;
  currentId?: number;

  editForm = new FormGroup({
    id: new FormControl({ value: null, disabled: true }),
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

  onCheckBoxEscalaChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.checkBoxEscalaIsChecked = inputElement.checked;
  }

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      updated: `Trayecto Vuelo modificado correctamente.`,
      TRAYECTO_VUELO_ORIGEN_UNIQUE: `Este Aeropuerto contiene una referencia a un Tratecto Vuelo.`
    };
    return messages[key];
  }

  ngOnInit() {
    this.currentId = +this.route.snapshot.params['id'];
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
    this.trayectoVueloService.getTrayectoVuelo(this.currentId!)
        .subscribe({
          next: (data) => updateForm(this.editForm, data),
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
  }

  handleSubmit() {
    window.scrollTo(0, 0);
    this.editForm.markAllAsTouched();
    if (!this.editForm.valid) {
      return;
    }
    const data = new TrayectoVueloDTO(this.editForm.value);
    this.trayectoVueloService.updateTrayectoVuelo(this.currentId!, data)
        .subscribe({
          next: () => this.router.navigate(['/trayectoVuelos'], {
            state: {
              msgSuccess: this.getMessage('updated')
            }
          }),
          error: (error) => this.errorHandler.handleServerError(error.error, this.editForm, this.getMessage)
        });
  }

}
