import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-wishlist-icon-button',
  standalone: true,
  imports: [MatBadgeModule, RouterLink],
  templateUrl: './wishlist-icon-button.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WishlistIconButtonComponent {
  @Input() numberOfWishlistItems!: number
}
