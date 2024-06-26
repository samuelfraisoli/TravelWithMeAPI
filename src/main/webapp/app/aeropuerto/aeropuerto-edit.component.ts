import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { InputRowComponent } from 'app/common/input-row/input-row.component';
import { AeropuertoService } from 'app/aeropuerto/aeropuerto.service';
import { AeropuertoDTO } from 'app/aeropuerto/aeropuerto.model';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { updateForm } from 'app/common/utils';


@Component({
  selector: 'app-aeropuerto-edit',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, InputRowComponent],
  templateUrl: './aeropuerto-edit.component.html'
})
export class AeropuertoEditComponent implements OnInit {

  aeropuertoService = inject(AeropuertoService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  errorHandler = inject(ErrorHandler);

  currentId?: number;

  editForm = new FormGroup({
    id: new FormControl({ value: null, disabled: true }),
    nombre: new FormControl(null, [Validators.required, Validators.maxLength(255)]),
    ciudad: new FormControl(null, [Validators.required, Validators.maxLength(255)]),
    ciudadAbrev: new FormControl(null, [Validators.required, Validators.maxLength(255)]),
    pais: new FormControl(null, [Validators.required, Validators.maxLength(255)])
  }, { updateOn: 'submit' });

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      updated: $localize`:@@aeropuerto.update.success:Aeropuerto ha sido editado correctamente.`
    };
    return messages[key];
  }

  ngOnInit() {
    this.currentId = +this.route.snapshot.params['id'];
    this.aeropuertoService.getAeropuerto(this.currentId!)
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
    const data = new AeropuertoDTO(this.editForm.value);
    this.aeropuertoService.updateAeropuerto(this.currentId!, data)
        .subscribe({
          next: () => this.router.navigate(['/aeropuertos'], {
            state: {
              msgSuccess: this.getMessage('updated')
            }
          }),
          error: (error) => this.errorHandler.handleServerError(error.error, this.editForm, this.getMessage)
        });
  }

}
