import { Pipe, PipeTransform } from '@angular/core';
import { map, Observable } from 'rxjs';

@Pipe({
  name: 'transformWithObservable',
  standalone: true
})
export class TransformWithObservablePipe implements PipeTransform {

  transform(value: any, transformation$: Observable<(data: any) => any>): Observable<any> {
    return transformation$.pipe(
      map(transformationFn => transformationFn(value))
    );
  }
}
