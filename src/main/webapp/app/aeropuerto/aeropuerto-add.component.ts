import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { InputRowComponent } from 'app/common/input-row/input-row.component';
import { AeropuertoService } from 'app/aeropuerto/aeropuerto.service';
import { AeropuertoDTO } from 'app/aeropuerto/aeropuerto.model';
import { ErrorHandler } from 'app/common/error-handler.injectable';


@Component({
  selector: 'app-aeropuerto-add',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, InputRowComponent],
  templateUrl: './aeropuerto-add.component.html'
})
export class AeropuertoAddComponent {


  aeropuertoService = inject(AeropuertoService);
  router = inject(Router);
  errorHandler = inject(ErrorHandler);

  addForm = new FormGroup({
    nombre: new FormControl(null, [Validators.required, Validators.maxLength(255)]),
    ciudad: new FormControl(null, [Validators.required, Validators.maxLength(255)]),
    ciudadAbrev: new FormControl(null, [Validators.required, Validators.maxLength(255)]),
    pais: new FormControl(null, [Validators.required, Validators.maxLength(255)])
  }, { updateOn: 'submit' });

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      created:`:Aeropuerto creado correctamente.`
    };
    return messages[key];
  }

  handleSubmit() {
    window.scrollTo(0, 0);
    this.addForm.markAllAsTouched();
    if (!this.addForm.valid) {
      return;
    }
    const data = new AeropuertoDTO(this.addForm.value);
    this.aeropuertoService.createAeropuerto(data)
        .subscribe({
          next: () => this.router.navigate(['/aeropuertos'], {
            state: {
              msgSuccess: this.getMessage('created')
            }
          }),
          error: (error) => this.errorHandler.handleServerError(error.error, this.addForm, this.getMessage)
        });
  }

}
