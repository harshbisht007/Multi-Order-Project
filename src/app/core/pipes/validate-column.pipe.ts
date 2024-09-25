import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'validateColumn',
  standalone: true
})
export class ValidateColumnPipe implements PipeTransform {

  transform(value: any, col: string): string {
    if (col === 'status') {
      if (value === 'INVALID') {
        return 'red';
      } else if (value === 'VALID') {
        return 'green';
      }
    } else if (col !== 'address' && typeof value === 'string' && value.includes(',')) {
      return 'red';
    } else if (col === 'touch_point_type') {
      if (value !== 'PICKUP' && value !== 'DROP') {
        return 'red'
      }
    }
    return 'inherit';
  }

}
