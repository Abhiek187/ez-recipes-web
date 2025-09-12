import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'label',
})
export class LabelPipe implements PipeTransform {
  /**
   * Convert a snake-case value to a human-readable label
   */
  transform(value: string): string {
    return value
      .replaceAll('-', ' ')
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  }
}
