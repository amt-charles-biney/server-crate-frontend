import { Component, Input, OnInit } from '@angular/core';
import { COLOR_MAPPING } from '../../../core/utils/constants';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-shipping-status',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './shipping-status.component.html',
})
export class ShippingStatusComponent implements OnInit {
  @Input() status!: string
  color!: string
  background!: string
  circle!: string

  ngOnInit(): void {
    if (this.status)
    this.color = COLOR_MAPPING[this.status]?.color || 'text-gray-400'
    this.background = COLOR_MAPPING[this.status]?.background || 'text-gray-400'
    this.circle = COLOR_MAPPING[this.status]?.circle || 'text-gray-400'
  }
}
