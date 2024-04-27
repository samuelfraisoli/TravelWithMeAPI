import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { InputRowComponent } from 'app/common/input-row/input-row.component';
import { DireccionService } from 'app/direccion/direccion.service';
import { DireccionDTO } from 'app/direccion/direccion.model';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { updateForm } from 'app/common/utils';


@Component({
  selector: 'app-direccion-edit',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, InputRowComponent],
  templateUrl: './direccion-edit.component.html'
})
export class DireccionEditComponent implements OnInit {

  direccionService = inject(DireccionService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  errorHandler = inject(ErrorHandler);

  currentId?: number;

  editForm = new FormGroup({
    id: new FormControl({ value: null, disabled: true }),
    direccionString: new FormControl(null, [Validators.required, Validators.maxLength(500)]),
    direccion1: new FormControl(null, [Validators.required, Validators.maxLength(255)]),
    direccion2: new FormControl(null, [Validators.maxLength(255)]),
    ciudad: new FormControl(null, [Validators.required, Validators.maxLength(255)]),
    pais: new FormControl(null, [Validators.required, Validators.maxLength(255)]),
    codPostal: new FormControl(null, [Validators.required, Validators.maxLength(255)])
  }, { updateOn: 'submit' });

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      updated: $localize`:@@direccion.update.success:Direccion was updated successfully.`
    };
    return messages[key];
  }

  ngOnInit() {
    this.currentId = +this.route.snapshot.params['id'];
    this.direccionService.getDireccion(this.currentId!)
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
    const data = new DireccionDTO(this.editForm.value);
    this.direccionService.updateDireccion(this.currentId!, data)
        .subscribe({
          next: () => this.router.navigate(['/direccions'], {
            state: {
              msgSuccess: this.getMessage('updated')
            }
          }),
          error: (error) => this.errorHandler.handleServerError(error.error, this.editForm, this.getMessage)
        });
  }

}
