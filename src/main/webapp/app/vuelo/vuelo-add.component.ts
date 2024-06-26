import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { InputRowComponent } from 'app/common/input-row/input-row.component';
import { VueloService } from 'app/vuelo/vuelo.service';
import { VueloDTO } from 'app/vuelo/vuelo.model';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { validDouble, validOffsetDateTime } from 'app/common/utils';


@Component({
  selector: 'app-vuelo-add',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, InputRowComponent],
  templateUrl: './vuelo-add.component.html'
})
export class VueloAddComponent implements OnInit {

  vueloService = inject(VueloService);
  router = inject(Router);
  errorHandler = inject(ErrorHandler);

  equipajeValues?: Map<number,string>;

  addForm = new FormGroup({
    idVuelo: new FormControl(null, [Validators.required, Validators.maxLength(255)]),
    aerolinea: new FormControl(null, [Validators.required, Validators.maxLength(255)]),
    precio: new FormControl(null, [Validators.required, validDouble]),
    tipo: new FormControl(null, [Validators.maxLength(255)]),
    origen: new FormControl(null, [Validators.required, Validators.maxLength(255)]),
    destino: new FormControl(null, [Validators.required, Validators.maxLength(255)]),
    fecha: new FormControl(null, [Validators.required, validOffsetDateTime]),
    equipaje: new FormControl(null)
  }, { updateOn: 'submit' });

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      created: $localize`:@@vuelo.create.success:Vuelo se ha creado correctamente.`
    };
    return messages[key];
  }

  ngOnInit() {
    this.vueloService.getEquipajeValues()
        .subscribe({
          next: (data) => this.equipajeValues = data,
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
  }

  handleSubmit() {
    window.scrollTo(0, 0);
    this.addForm.markAllAsTouched();
    if (!this.addForm.valid) {
      return;
    }
    const data = new VueloDTO(this.addForm.value);
    this.vueloService.createVuelo(data)
        .subscribe({
          next: () => this.router.navigate(['/vuelos'], {
            state: {
              msgSuccess: this.getMessage('created')
            }
          }),
          error: (error) => this.errorHandler.handleServerError(error.error, this.addForm, this.getMessage)
        });
  }

}
