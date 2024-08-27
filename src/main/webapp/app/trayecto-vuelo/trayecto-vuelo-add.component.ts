import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { InputRowComponent } from 'app/common/input-row/input-row.component';
import { TrayectoVueloService } from 'app/trayecto-vuelo/trayecto-vuelo.service';
import { TrayectoVueloDTO } from 'app/trayecto-vuelo/trayecto-vuelo.model';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { validOffsetDateTime } from 'app/common/utils';
import { convertToOffsetDateTime} from 'app/common/utils';
 

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

  checkBoxEscalaIsChecked = false;

  vueloValues?: Map<number,string>;
  origenValues?: Map<number,string>;
  destinoValues?: Map<number,string>;

  addForm = new FormGroup({
    idTrayecto: new FormControl(null, [Validators.required, Validators.maxLength(255)]),
    aerolinea: new FormControl(null, [Validators.required, Validators.maxLength(255)]),
    tipo: new FormControl(null, [Validators.maxLength(255)]),
    fechaSalida: new FormControl(null, [Validators.required]),
    fechaLlegada: new FormControl(null, [Validators.required]),
    escala: new FormControl(false),
    fechaInicioEscala: new FormControl(null),
    fechaFinEscala: new FormControl(null),
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
      created: `Trayecto Vuelo was created successfully.`
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
    const formValue = new TrayectoVueloDTO(this.addForm.value);

    //converts dates to offsetDateTime because the backend uses this kind of date
    const data = new TrayectoVueloDTO({
      ...formValue,
      fechaSalida: convertToOffsetDateTime(formValue.fechaSalida),
      fechaLlegada: convertToOffsetDateTime(formValue.fechaLlegada),
      fechaInicioEscala: convertToOffsetDateTime(formValue.fechaInicioEscala),
      fechaFinEscala: convertToOffsetDateTime(formValue.fechaFinEscala)
  });
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
