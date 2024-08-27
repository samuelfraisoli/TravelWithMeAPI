import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { InputRowComponent } from 'app/common/input-row/input-row.component';
import { DetallesHotelService } from 'app/detalles-hotel/detalles-hotel.service';
import { DetallesHotelDTO } from 'app/detalles-hotel/detalles-hotel.model';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { validJson } from 'app/common/utils';



@Component({
  selector: 'app-detalles-hotel-add',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, InputRowComponent],
  templateUrl: './detalles-hotel-add.component.html'
})
export class DetallesHotelAddComponent {

  detallesHotelService = inject(DetallesHotelService);
  router = inject(Router);
  errorHandler = inject(ErrorHandler);

  addForm = new FormGroup({
    descripcion: new FormControl(null, [Validators.maxLength(2000)]),
    web: new FormControl(null, [Validators.maxLength(255)]),
    telefono: new FormControl(null, [Validators.maxLength(255)]),
    comodidades: new FormControl(null, [validJson])
  }, { updateOn: 'submit' });

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      created: `Detalles de Hotel creados correctamente.`
    };
    return messages[key];
  }

  handleSubmit() {
    window.scrollTo(0, 0);
    this.addForm.markAllAsTouched();
    if (!this.addForm.valid) {
      return;
    }
    const data = new DetallesHotelDTO(this.addForm.value);
    this.detallesHotelService.createDetallesHotel(data)
        .subscribe({
          next: () => this.router.navigate(['/detallesHotels'], {
            state: {
              msgSuccess: this.getMessage('created')
            }
          }),
          error: (error) => this.errorHandler.handleServerError(error.error, this.addForm, this.getMessage)
        });
  }

}
