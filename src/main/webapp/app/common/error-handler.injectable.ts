import { inject, Injectable } from '@angular/core';
import { FormGroup, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { validJson } from 'app/common/utils';


@Injectable({
  providedIn: 'root'
})
export class ErrorHandler {

  router = inject(Router);

  /**
   * Handle server errors and show the error page if required. If provided, write all field errors
   * from the server response to the matching form fields. Resolves the error message from the
   * errorMessages map if available.
   */
  handleServerError(error: ErrorResponse, group?: FormGroup, getMessage?: (key: string) => string) {
    // show general error page
    if (!error || !error.fieldErrors) {
      this.router.navigate(['/error'], {
            state: {
              errorStatus: error.status ? '' + error.status : '503'
            }
          });
      return;
    }

    // collect errors for each field
    const errorsMap: Record<string, ValidationErrors> = {};
    for (const fieldError of error.fieldErrors) {
      const fieldName = fieldError.property.split(/[\.\[]/)[0];
      if (!errorsMap[fieldName]) {
        errorsMap[fieldName] = {};
      }
      // look for message under key <fieldName>.<code> or <code>
      // use global error message or error code as fallback
      let errorMessage = getGlobalErrorMessage(fieldError.code) || fieldError.code;
      if (getMessage) {
        errorMessage = getMessage(fieldError.property + '.' + fieldError.code) ||
            getMessage(fieldError.code) || errorMessage;
      }
      // json nested errors
      if (fieldName !== fieldError.property) {
        errorMessage = fieldError.property + ': ' + errorMessage;
      }
      errorsMap[fieldName][fieldError.code] = errorMessage;
    }
    // write errors to fields
    for (const [key, value] of Object.entries(errorsMap)) {
      group?.get(key)?.setErrors(value);
    }
  }

  /**
   * Update all controls of the provided form group with the given data.
   */
  updateForm(group: FormGroup, data: any) {
    for (const field in group.controls) {
      const control = group.get(field)!;
      let value = data[field] || null;
      if (value && control.hasValidator(validJson)) {
        value = JSON.stringify(value, null, 2);
      }
      control.setValue(value);
    }
  }

}

/**
 * Get an error message for a set of defined keys. Optional parameters can be used within
 * each message (for example with ${value}).
 */
export function getGlobalErrorMessage(key: string, details?: any) {
  let globalErrorMessages: Record<string, string> = {
    required: `Campo requerido`,
    maxlength: `La longitud máxima es de ${details?.requiredLength} caracteres.`,
    validDouble: `Introduce un número decimal válido.`,
    validOffsetDateTime: `Please provide a valid date with offset, for example "2026-01-23T14:55:00+01:00".`,
    validJson: `Introduce un formato JSON válido.`,
    REQUIRED_NOT_NULL:`Campo requerido.`
  };
  return globalErrorMessages[key];
}

interface FieldError {

  code: string;
  property: string;
  message: string;
  rejectedValue: any|null;
  path: string|null;

}

interface ErrorResponse {

  status: number;
  code: string;
  message: string;
  fieldErrors?: FieldError[];

}
