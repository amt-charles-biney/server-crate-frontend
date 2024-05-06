import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Store } from '@ngrx/store';
import { addToWishlist, removeFromWishlist, startLoader } from '../../../store/admin/products/categories/categories.actions';
import { CommonModule } from '@angular/common';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-wishlist-button',
  standalone: true,
  imports: [CommonModule, MatProgressSpinner],
  templateUrl: './wishlist-button.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WishlistButtonComponent implements OnChanges {
  @Input() alreadyInWishlist!: string | boolean | undefined
  @Input() isLoadingInput!: boolean
  @Input() id!: string

  inWishList: boolean = false
  constructor(private store: Store) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes) {
      if (changes['alreadyInWishlist']) {
        this.inWishList = changes['alreadyInWishlist'].currentValue
      }
    }
  }
  addToWishlist(id: string) {
    this.store.dispatch(addToWishlist({ id, configOptions: { components: '', warranty: false } }));
  }

  removeFromWishlist(id: string) {
    this.store.dispatch(removeFromWishlist({ id }));
  }

  addOrRemoveFromWishlist(id: string) {
    if (this.inWishList) {
      this.removeFromWishlist(id)
    } else {
      this.addToWishlist(id)
    }
    this.store.dispatch(startLoader({ id }))
  }
}
