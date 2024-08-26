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

  addForm: FormGroup;

  constructor() {
    this.addForm = new FormGroup({
      nombre: new FormControl(null, [Validators.required, Validators.maxLength(255)]),
      ciudad: new FormControl(null, [Validators.required, Validators.maxLength(255)]),
      ciudadAbrev: new FormControl(null, [Validators.required, Validators.maxLength(255)]),
      pais: new FormControl(null, [Validators.required, Validators.maxLength(255)])
    }, { updateOn: 'submit' });

  }

  //formgroup
  

  //mensajes de error para todas las propiedades
  errorMessages: any = {
    nombre: {
      required: 'Nombre es requerido',
      maxlength: 'Nombre no puede tener más de 255 caracteres'
    },
    ciudad: {
      required: 'Ciudad es requerida',
      maxlength: 'Ciudad no puede tener más de 255 caracteres'
    },
    ciudadAbrev: {
      required: 'Abreviatura es requerida',
      maxlength: 'Abreviatura no puede tener más de 255 caracteres'
    },
    pais: {
      required: 'Pais es requerido',
      maxlength: 'Pais no puede tener más de 255 caracteres',
      positiveNumber: 'El número debe ser positivo'
    }
  };

  //
  getMessage() {
    return "Aeropuerto creado correctamente"
  }

  getError(controlName: string): string {
    const control = this.addForm.get(controlName);
    if (control && control.invalid && (control.dirty || control.touched)) {
      const errors = control.errors;
      //si errors existe, o sea si el formcontrol tiene errores, va a buscar en el array los strings
      if (errors) {
        console.log("errors" + errors + errors[0])
        const errorKey = Object.keys(errors)[0];
        return this.errorMessages[controlName][errorKey];
       
      }
    }
    return '';
  }

  handleSubmit() {
    window.scrollTo(0, 0);
    //marca todos los campos como touched para que se revisen todos y salgan mensajes de error si los hay
    this.addForm.markAllAsTouched();
    if (!this.addForm.valid) {
      return;
    }
    const data = new AeropuertoDTO(this.addForm.value);
    this.aeropuertoService.createAeropuerto(data)
        .subscribe({
          next: () => this.router.navigate(['/aeropuertos'], {
            //state envía al router de angular que el estado del formulario es correcto
            state: {
              msgSuccess: this.getMessage()
            }
          }),
          error: (error) => this.errorHandler.handleServerError(error.error, this.addForm)
        });
  }

}
