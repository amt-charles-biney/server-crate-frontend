import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CreditCard } from '../../../types';
import { SlicePipe } from '@angular/common';
import { Store } from '@ngrx/store';
import { deletePaymentInfo } from '../../../store/account-settings/general-info/general-info.actions';
import { IMAGE_MAPPING } from '../../../core/utils/constants';

@Component({
  selector: 'app-card-list',
  standalone: true,
  imports: [SlicePipe],
  templateUrl: './card-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardListComponent {
  @Input() cards!: CreditCard[]
  @Input() page!: 'checkout' | 'default'
  @Output() cardEmitter = new EventEmitter<CreditCard>()
  images = IMAGE_MAPPING
  constructor(private store: Store) {}

  deleteCard(id: string) {
    this.store.dispatch(deletePaymentInfo({ id, isWallet: false }))
  }

  selectCard(card: CreditCard) {
    this.cardEmitter.emit(card)
  }
}
