import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { InputRowComponent } from 'app/common/input-row/input-row.component';
import { VueloService } from 'app/vuelo/vuelo.service';
import { VueloDTO } from 'app/vuelo/vuelo.model';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { updateForm, validDouble, validOffsetDateTime } from 'app/common/utils';


@Component({
  selector: 'app-vuelo-edit',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, InputRowComponent],
  templateUrl: './vuelo-edit.component.html'
})
export class VueloEditComponent implements OnInit {

  vueloService = inject(VueloService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  errorHandler = inject(ErrorHandler);

  equipajeValues?: Map<number,string>;
  currentId?: number;

  editForm = new FormGroup({
    id: new FormControl({ value: null, disabled: true }),
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
      updated: $localize`:@@vuelo.update.success:Vuelo creado correctamente.`
    };
    return messages[key];
  }

  ngOnInit() {
    this.currentId = +this.route.snapshot.params['id'];
    this.vueloService.getEquipajeValues()
        .subscribe({
          next: (data) => this.equipajeValues = data,
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
    this.vueloService.getVuelo(this.currentId!)
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
    const data = new VueloDTO(this.editForm.value);
    this.vueloService.updateVuelo(this.currentId!, data)
        .subscribe({
          next: () => this.router.navigate(['/vuelos'], {
            state: {
              msgSuccess: this.getMessage('updated')
            }
          }),
          error: (error) => this.errorHandler.handleServerError(error.error, this.editForm, this.getMessage)
        });
  }

}
