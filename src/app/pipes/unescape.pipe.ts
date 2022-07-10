import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'unescape',
})
export class UnescapePipe implements PipeTransform {
  transform(html: string): unknown {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.documentElement.textContent;
  }
}
