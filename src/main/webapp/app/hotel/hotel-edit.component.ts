import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { InputRowComponent } from 'app/common/input-row/input-row.component';
import { HotelService } from 'app/hotel/hotel.service';
import { HotelDTO } from 'app/hotel/hotel.model';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { updateForm, validJson } from 'app/common/utils';


@Component({
  selector: 'app-hotel-edit',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, InputRowComponent],
  templateUrl: './hotel-edit.component.html'
})
export class HotelEditComponent implements OnInit {

  hotelService = inject(HotelService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  errorHandler = inject(ErrorHandler);

  direccionValues?: Map<number,string>;
  detallesHotelValues?: Map<number,string>;
  currentId?: number;

  editForm = new FormGroup({
    id: new FormControl({ value: null, disabled: true }),
    nombre: new FormControl(null, [Validators.required, Validators.maxLength(255)]),
    fotos: new FormControl(null, [Validators.required, validJson]),
    fechasLibres: new FormControl(null, [validJson]),
    direccion: new FormControl(null, [Validators.required]),
    detallesHotel: new FormControl(null, [Validators.required])
  }, { updateOn: 'submit' });

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      updated: `Hotel modificado correctamente.`,
      HOTEL_DIRECCION_UNIQUE: `Esta Dirección ya está referenciada por otro Hotel.`,
      HOTEL_DETALLES_HOTEL_UNIQUE: `Estos Detalles del Hotel ya están referenciados por otro Hotel.`
    };
    return messages[key];
  }

  ngOnInit() {
    this.currentId = +this.route.snapshot.params['id'];
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
    this.hotelService.getHotel(this.currentId!)
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
    const data = new HotelDTO(this.editForm.value);
    this.hotelService.updateHotel(this.currentId!, data)
        .subscribe({
          next: () => this.router.navigate(['/hoteles'], {
            state: {
              msgSuccess: this.getMessage('updated')
            }
          }),
          error: (error) => this.errorHandler.handleServerError(error.error, this.editForm, this.getMessage)
        });
  }

}
