import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MobileMoneyWallet } from '../../../types';
import { IMAGE_MAPPING } from '../../../core/utils/constants';
import { Store } from '@ngrx/store';
import { deletePaymentInfo } from '../../../store/account-settings/general-info/general-info.actions';

@Component({
  selector: 'app-wallet-list',
  standalone: true,
  imports: [],
  templateUrl: './wallet-list.component.html',
})
export class WalletListComponent {
  @Input() wallets!: MobileMoneyWallet[]
  @Input() page!: 'checkout' | 'default'
  @Output() walletEmitter = new EventEmitter<MobileMoneyWallet>()
  images = IMAGE_MAPPING

  constructor(private store: Store) {}
  deleteWallet(id: string) {
    this.store.dispatch(deletePaymentInfo({ id, isWallet: true }))
  }

  selectWallet(wallet: MobileMoneyWallet) {
    this.walletEmitter.emit(wallet)
  }
}
