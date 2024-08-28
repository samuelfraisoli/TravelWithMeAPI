import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'booleanToText',
  standalone: true
})
export class BooleanToTextPipe implements PipeTransform {

  transform(value: boolean | null | undefined): string {
    if (value === null || value === undefined) {
      return ''; 
    }

    return value ? "Sí" : "No";
  }

}
