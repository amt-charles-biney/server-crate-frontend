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
    this.color = COLOR_MAPPING[this.status].color
    this.background = COLOR_MAPPING[this.status].background
    this.circle = COLOR_MAPPING[this.status].circle
  }
}
