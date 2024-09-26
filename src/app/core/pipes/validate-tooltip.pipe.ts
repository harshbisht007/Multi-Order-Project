import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'validateTooltip',
  standalone: true
})
export class ValidateTooltipPipe implements PipeTransform {
  transform(value: any, col: string): string | undefined {
    if (col === 'status' && value === 'INVALID') {
      return 'This status is INVALID.';
    } else if (col !== 'address' && typeof value === 'string' && value.includes(',')) {
      return 'Invalid data format (commas detected).';
    } else if (col === 'touch_point_type' && (value !== 'PICKUP' && value !== 'DROP')) {
      return 'Touch point type must be PICKUP or DROP.';
    } 
    return undefined;  // No tooltip if data is valid
  }
}
