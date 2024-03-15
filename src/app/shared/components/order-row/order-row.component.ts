import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Content } from '../../../types';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CustomCheckBoxComponent } from '../custom-check-box/custom-check-box.component';
import { CurrencyPipe, DatePipe, NgOptimizedImage } from '@angular/common';
import { CloudinaryUrlPipe } from '../../pipes/cloudinary-url/cloudinary-url.pipe';
import { ShippingStatusComponent } from '../shipping-status/shipping-status.component';
import { MatMenuModule } from '@angular/material/menu';
import { RouterModule } from '@angular/router';
import { NAME_MAPPING } from '../../../core/utils/constants';

@Component({
  selector: 'app-order-row',
  standalone: true,
  imports: [
    CustomCheckBoxComponent,
    ReactiveFormsModule,
    NgOptimizedImage,
    CloudinaryUrlPipe,
    CurrencyPipe,
    DatePipe,
    ShippingStatusComponent,
    MatMenuModule,
    RouterModule
  ],
  templateUrl: './order-row.component.html',
})
export class OrderRowComponent implements OnInit {
  @Input() order!: Content;
  @Input() control!: FormControl;
  @Input() isAdmin!: boolean
  @Output() itemSelectedEmitter = new EventEmitter<{
    selected: { name: string; value: string; isAdded: boolean };
    id: string;
  }>();
  status!: string

  ngOnInit(): void {
    this.status = NAME_MAPPING[this.order.status]
  }

  itemSelected(
    selected: { name: string; value: string; isAdded: boolean },
    id: string
  ) {
    this.itemSelectedEmitter.emit({ selected, id });
  }
}
