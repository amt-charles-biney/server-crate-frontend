import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Content } from '../../../types';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CustomCheckBoxComponent } from '../custom-check-box/custom-check-box.component';
import { CurrencyPipe, DatePipe, NgOptimizedImage } from '@angular/common';
import { CloudinaryUrlPipe } from '../../pipes/cloudinary-url/cloudinary-url.pipe';
import { ShippingStatusComponent } from '../shipping-status/shipping-status.component';

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
    ShippingStatusComponent
  ],
  templateUrl: './order-row.component.html',
})
export class OrderRowComponent {
  @Input() order!: Content;
  @Input() control!: FormControl;
  @Output() itemSelectedEmitter = new EventEmitter<{
    selected: { name: string; value: string; isAdded: boolean };
    id: string;
  }>();

  itemSelected(
    selected: { name: string; value: string; isAdded: boolean },
    id: string
  ) {
    this.itemSelectedEmitter.emit({ selected, id });
  }
}
