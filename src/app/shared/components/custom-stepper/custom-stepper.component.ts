import { CdkStepper, CdkStepperModule } from '@angular/cdk/stepper';
import { CommonModule, NgTemplateOutlet } from '@angular/common';
import { Component, ContentChildren, Input, OnChanges, OnInit, QueryList, SimpleChanges } from '@angular/core';
import { matStepperAnimations } from '@angular/material/stepper';

@Component({
  selector: 'app-custom-stepper',
  standalone: true,
  imports: [NgTemplateOutlet, CdkStepperModule, CommonModule],
  templateUrl: './custom-stepper.component.html',
  styleUrl: './custom-stepper.component.scss',
  providers: [{provide: CdkStepper, useExisting: CustomStepperComponent}],
  animations: [
    matStepperAnimations.horizontalStepTransition
  ]
})
export class CustomStepperComponent extends CdkStepper implements OnChanges{

  @Input() completed!: boolean;
  @Input() price!: number
  @Input() status!: string
  @Input() isAdmin!: boolean
  @Input() customClass!: string

  isCanceled: boolean = false

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['status']) {
      this.changeStepBasedOnStatus(changes['status'].currentValue)
    }
  }

  selectStepByIndex(index: number): void {    
    this.selectedIndex = index;
  }

  changeStepBasedOnStatus(status: string) {
    switch (status) {
      case 'Order Confirmed': 
        this.selectedIndex = 0;
        break;
      case 'Assembling': 
        this.selectedIndex = 1;
        break;
      case 'Pending':
        this.selectedIndex = 2;
        break;
      case 'Cancelled':
        this.selectedIndex = 2;
        break;
      case 'Shipped':
        this.selectedIndex = 3;
        break;
      case 'Out For Delivery': 
        this.selectedIndex = 4;
        break;
      case 'Delivered':
        if (this.isAdmin) {
          this.selectedIndex = 5;
        } else {
          this.selectedIndex = 4
        }
        break;
    }
  }
}
