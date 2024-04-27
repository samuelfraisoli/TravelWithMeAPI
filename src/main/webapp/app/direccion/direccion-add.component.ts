import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { InputRowComponent } from 'app/common/input-row/input-row.component';
import { DireccionService } from 'app/direccion/direccion.service';
import { DireccionDTO } from 'app/direccion/direccion.model';
import { ErrorHandler } from 'app/common/error-handler.injectable';


@Component({
  selector: 'app-direccion-add',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, InputRowComponent],
  templateUrl: './direccion-add.component.html'
})
export class DireccionAddComponent {

  direccionService = inject(DireccionService);
  router = inject(Router);
  errorHandler = inject(ErrorHandler);

  addForm = new FormGroup({
    direccionString: new FormControl(null, [Validators.required, Validators.maxLength(500)]),
    direccion1: new FormControl(null, [Validators.required, Validators.maxLength(255)]),
    direccion2: new FormControl(null, [Validators.maxLength(255)]),
    ciudad: new FormControl(null, [Validators.required, Validators.maxLength(255)]),
    pais: new FormControl(null, [Validators.required, Validators.maxLength(255)]),
    codPostal: new FormControl(null, [Validators.required, Validators.maxLength(255)])
  }, { updateOn: 'submit' });

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      created: $localize`:@@direccion.create.success:Direccion was created successfully.`
    };
    return messages[key];
  }

  handleSubmit() {
    window.scrollTo(0, 0);
    this.addForm.markAllAsTouched();
    if (!this.addForm.valid) {
      return;
    }
    const data = new DireccionDTO(this.addForm.value);
    this.direccionService.createDireccion(data)
        .subscribe({
          next: () => this.router.navigate(['/direccions'], {
            state: {
              msgSuccess: this.getMessage('created')
            }
          }),
          error: (error) => this.errorHandler.handleServerError(error.error, this.addForm, this.getMessage)
        });
  }

}
