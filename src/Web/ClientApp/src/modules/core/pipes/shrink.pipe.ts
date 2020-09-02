import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shrink'
})
export class ShrinkPipe implements PipeTransform {
  transform(text: string, maxLength = 60, postfix = '...'): string {
    return text?.length > maxLength ? text.slice(0, maxLength) + postfix : text;
  }
}
