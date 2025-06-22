import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shorthand',
})
export class ShorthandPipe implements PipeTransform {
  /**
   * Convert a number to a shorthand string (e.g., 1234 --> 1.2K)
   */
  transform(value: number): string {
    return Intl.NumberFormat('en', { notation: 'compact' }).format(value);
  }
}
