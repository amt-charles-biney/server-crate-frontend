import { Component, Input } from '@angular/core';
import { CreditCard } from '../../../types';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { deletePaymentInfo } from '../../../store/account-settings/general-info/general-info.actions';

@Component({
  selector: 'app-card-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-list.component.html',
})
export class CardListComponent {
  @Input() cards!: CreditCard[]
  constructor(private store: Store) {}

  deleteCard(id: string) {
    this.store.dispatch(deletePaymentInfo({ id }))
  }
}
