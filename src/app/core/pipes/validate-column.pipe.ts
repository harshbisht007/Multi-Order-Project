import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'validateColumn',
  standalone: true
})
export class ValidateColumnPipe implements PipeTransform {

  transform(value: any, col: string): string {
    
    const isNullOrEmpty = (val: any) => val === null || val === undefined || val === '';

    switch (col) {
      case 'status':
        return value === 'INVALID' ? 'red' : value === 'VALID' ? 'green' : 'inherit';
        
      case 'touch_point_type':
        return (value !== 'PICKUP' && value !== 'DROP') ? 'red' : 'inherit';

      case 'latitude':
      case 'longitude':
        return isNullOrEmpty(value) ? 'red' : 'inherit';

      default:
        // Handle string columns (except 'address') containing commas
        if (col !== 'address' && typeof value === 'string' && value.includes(',')) {
          return 'red';
        }
        return 'inherit';
    }
  }
}
