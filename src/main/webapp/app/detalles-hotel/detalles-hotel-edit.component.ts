import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { InputRowComponent } from 'app/common/input-row/input-row.component';
import { DetallesHotelService } from 'app/detalles-hotel/detalles-hotel.service';
import { DetallesHotelDTO } from 'app/detalles-hotel/detalles-hotel.model';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { updateForm, validJson } from 'app/common/utils';


@Component({
  selector: 'app-detalles-hotel-edit',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, InputRowComponent],
  templateUrl: './detalles-hotel-edit.component.html'
})
export class DetallesHotelEditComponent implements OnInit {

  detallesHotelService = inject(DetallesHotelService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  errorHandler = inject(ErrorHandler);

  currentId?: number;

  editForm = new FormGroup({
    id: new FormControl({ value: null, disabled: true }),
    descripcion: new FormControl(null, [Validators.maxLength(2000)]),
    web: new FormControl(null, [Validators.maxLength(255)]),
    telefono: new FormControl(null, [Validators.maxLength(255)]),
    comodidades: new FormControl(null, [validJson])
  }, { updateOn: 'submit' });

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      updated: `Detalles de Hotel modificados correctamente.`
    };
    return messages[key];
  }

  ngOnInit() {
    this.currentId = +this.route.snapshot.params['id'];
    this.detallesHotelService.getDetallesHotel(this.currentId!)
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
    const data = new DetallesHotelDTO(this.editForm.value);
    this.detallesHotelService.updateDetallesHotel(this.currentId!, data)
        .subscribe({
          next: () => this.router.navigate(['/detallesHotels'], {
            state: {
              msgSuccess: this.getMessage('updated')
            }
          }),
          error: (error) => this.errorHandler.handleServerError(error.error, this.editForm, this.getMessage)
        });
  }

}
