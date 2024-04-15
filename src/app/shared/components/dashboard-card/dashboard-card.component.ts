import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MoneyFormatPipe } from '../../pipes/MoneyFormat/money-format.pipe';

@Component({
  selector: 'app-dashboard-card',
  standalone: true,
  imports: [CurrencyPipe, MoneyFormatPipe],
  templateUrl: './dashboard-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardCardComponent {
  @Input() title!: string
  @Input() isCurrency:boolean = false
  @Input() iconPath!: string
  @Input() amount!: number;
  @Input() statistic!: string
  
}
