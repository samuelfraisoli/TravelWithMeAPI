import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { InputRowComponent } from 'app/common/input-row/input-row.component';
import { HotelService } from 'app/hotel/hotel.service';
import { HotelDTO } from 'app/hotel/hotel.model';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { validJson } from 'app/common/utils';


@Component({
  selector: 'app-hotel-add',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, InputRowComponent],
  templateUrl: './hotel-add.component.html'
})
export class HotelAddComponent implements OnInit {

  hotelService = inject(HotelService);
  router = inject(Router);
  errorHandler = inject(ErrorHandler);

  direccionValues?: Map<number,string>;
  detallesHotelValues?: Map<number,string>;

  addForm = new FormGroup({
    nombre: new FormControl(null, [Validators.required, Validators.maxLength(255)]),
    fotos: new FormControl(null, [Validators.required, validJson]),
    fechasLibres: new FormControl(null, [validJson]),
    direccion: new FormControl(null, [Validators.required]),
    detallesHotel: new FormControl(null, [Validators.required])
  }, { updateOn: 'submit' });

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      created: `Hotel was created successfully.`,
      HOTEL_DIRECCION_UNIQUE: `Esta Dirección ya está referenciada por otro Hotel.`,
      HOTEL_DETALLES_HOTEL_UNIQUE: `Estos Detalles ya están referenciados por otro Hotel.`
    };
    return messages[key];
  }

  ngOnInit() {
    this.hotelService.getDireccionValues()
        .subscribe({
          next: (data) => this.direccionValues = data,
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
    this.hotelService.getDetallesHotelValues()
        .subscribe({
          next: (data) => this.detallesHotelValues = data,
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
  }

  handleSubmit() {
    window.scrollTo(0, 0);
    this.addForm.markAllAsTouched();
    if (!this.addForm.valid) {
      return;
    }
    const data = new HotelDTO(this.addForm.value);
    this.hotelService.createHotel(data)
        .subscribe({
          next: () => this.router.navigate(['/hoteles'], {
            state: {
              msgSuccess: this.getMessage('created')
            }
          }),
          error: (error) => this.errorHandler.handleServerError(error.error, this.addForm, this.getMessage)
        });
  }

}
