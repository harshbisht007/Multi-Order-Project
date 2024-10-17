import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'validateTooltip',
  standalone: true
})
export class ValidateTooltipPipe implements PipeTransform {

  transform(value: any, col: string): string | undefined {
    const isNullOrInvalid = (val: any) => val === null || val === undefined || val === '' || val === 'INVALID';

    const isInvalidLatLon = (col: string, value: any) => 
      (col === 'latitude' || col === 'longitude') && isNullOrInvalid(value);
    
    switch (col) {
      case 'status':
        return value === 'INVALID' || value === null || value === undefined ? 'This status is INVALID or missing.' : undefined;

      case 'latitude':
      case 'longitude':
        return isInvalidLatLon(col, value) ? `Invalid or missing data for ${col}` : undefined;

      case 'touch_point_type':
        return (value !== 'PICKUP' && value !== 'DROP') || isNullOrInvalid(value)
          ? 'Touch point type must be PICKUP or DROP and cannot be empty.' 
          : undefined;

      default:
        if (col !== 'address' && typeof value === 'string' && value.includes(',')) {
          return 'Invalid data format (commas detected).';
        }
        return isNullOrInvalid(value) ? 'Data is missing or invalid.' : undefined;
    }
  }
}
