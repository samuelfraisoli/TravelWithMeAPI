import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { InputRowComponent } from 'app/common/input-row/input-row.component';
import { ResenaService } from 'app/resena/resena.service';
import { ResenaDTO } from 'app/resena/resena.model';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { updateForm, validOffsetDateTime } from 'app/common/utils';


@Component({
  selector: 'app-resena-edit',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, InputRowComponent],
  templateUrl: './resena-edit.component.html'
})
export class ResenaEditComponent implements OnInit {

  resenaService = inject(ResenaService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  errorHandler = inject(ErrorHandler);

  hotelValues?: Map<number,string>;
  currentId?: number;

  editForm = new FormGroup({
    id: new FormControl({ value: null, disabled: true }),
    idUsuario: new FormControl(null, [Validators.maxLength(255)]),
    fecha: new FormControl(null, [Validators.required, validOffsetDateTime]),
    titulo: new FormControl(null, [Validators.maxLength(255)]),
    contenido: new FormControl(null, [Validators.required, Validators.maxLength(2000)]),
    nota: new FormControl(null),
    hotel: new FormControl(null)
  }, { updateOn: 'submit' });

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      updated: $localize`:@@resena.update.success:Resena was updated successfully.`
    };
    return messages[key];
  }

  ngOnInit() {
    this.currentId = +this.route.snapshot.params['id'];
    this.resenaService.getHotelValues()
        .subscribe({
          next: (data) => this.hotelValues = data,
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
    this.resenaService.getResena(this.currentId!)
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
    const data = new ResenaDTO(this.editForm.value);
    this.resenaService.updateResena(this.currentId!, data)
        .subscribe({
          next: () => this.router.navigate(['/resenas'], {
            state: {
              msgSuccess: this.getMessage('updated')
            }
          }),
          error: (error) => this.errorHandler.handleServerError(error.error, this.editForm, this.getMessage)
        });
  }

}
