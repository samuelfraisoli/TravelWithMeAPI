import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { InputRowComponent } from 'app/common/input-row/input-row.component';
import { ResenaService } from 'app/resena/resena.service';
import { ResenaDTO } from 'app/resena/resena.model';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { validOffsetDateTime } from 'app/common/utils';


@Component({
  selector: 'app-resena-add',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, InputRowComponent],
  templateUrl: './resena-add.component.html'
})
export class ResenaAddComponent implements OnInit {

  resenaService = inject(ResenaService);
  router = inject(Router);
  errorHandler = inject(ErrorHandler);

  hotelValues?: Map<number,string>;

  addForm = new FormGroup({
    idUsuario: new FormControl(null, [Validators.maxLength(255)]),
    fecha: new FormControl(null, [Validators.required, validOffsetDateTime]),
    titulo: new FormControl(null, [Validators.maxLength(255)]),
    contenido: new FormControl(null, [Validators.required, Validators.maxLength(2000)]),
    nota: new FormControl(null),
    hotel: new FormControl(null)
  }, { updateOn: 'submit' });

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      created: $localize`:@@resena.create.success:Resena was created successfully.`
    };
    return messages[key];
  }

  ngOnInit() {
    this.resenaService.getHotelValues()
        .subscribe({
          next: (data) => this.hotelValues = data,
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
  }

  handleSubmit() {
    window.scrollTo(0, 0);
    this.addForm.markAllAsTouched();
    if (!this.addForm.valid) {
      return;
    }
    const data = new ResenaDTO(this.addForm.value);
    this.resenaService.createResena(data)
        .subscribe({
          next: () => this.router.navigate(['/resenas'], {
            state: {
              msgSuccess: this.getMessage('created')
            }
          }),
          error: (error) => this.errorHandler.handleServerError(error.error, this.addForm, this.getMessage)
        });
  }

}
