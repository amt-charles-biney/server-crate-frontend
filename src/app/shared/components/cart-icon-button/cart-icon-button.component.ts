import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cart-icon-button',
  standalone: true,
  imports: [MatBadgeModule, RouterLink],
  templateUrl: './cart-icon-button.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartIconButtonComponent {
  @Input() numberOfCartItems!: number

}
