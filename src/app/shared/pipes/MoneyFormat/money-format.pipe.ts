import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'moneyFormat',
  standalone: true
})
export class MoneyFormatPipe implements PipeTransform {

  transform(value: number, ): string {
    if (value > 1000000) {
      return `\$${(value/1000000).toFixed()}M`

    } else if ( value >= 1000) {
      return `\$${(value/1000).toFixed()}K`
    }
    return `${value}`
  }
}
