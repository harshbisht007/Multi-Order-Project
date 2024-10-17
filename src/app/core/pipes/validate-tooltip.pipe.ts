import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'validateTooltip',
  standalone: true
})
export class ValidateTooltipPipe implements PipeTransform {

  transform(value: any, col: string): string | undefined {
    const isInvalidLatLon = (col: string, value: any) => 
      (col === 'latitude' || col === 'longitude') && (value === null || value === undefined || value === '' || value === 'INVALID');
    
    switch (col) {
      case 'status':
        return value === 'INVALID' ? 'This status is INVALID.' : undefined;

      case 'latitude':
      case 'longitude':
        return isInvalidLatLon(col, value) ? `Invalid Data for ${col}` : undefined;

      case 'touch_point_type':
        return (value !== 'PICKUP' && value !== 'DROP') 
          ? 'Touch point type must be PICKUP or DROP.' 
          : undefined;

      default:
        if (col !== 'address' && typeof value === 'string' && value.includes(',')) {
          return 'Invalid data format (commas detected).';
        }
        return undefined;
    }
  }
}
