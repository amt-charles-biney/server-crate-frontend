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

  ngOnChanges(changes: SimpleChanges): void {
    console.log('Changes', changes);
    if (changes['status']) {
      this.changeStepBasedOnStatus(changes['status'].currentValue)
    }
  }

  selectStepByIndex(index: number): void {    
    this.selectedIndex = index;
  }

  changeStepBasedOnStatus(status: string) {
    console.log(status);
    
    switch (status) {
      case 'Pending': 
        this.selectedIndex = 0;
        break;
      case 'Shipped': 
        this.selectedIndex = 1;
        break;
      case 'Out For Delivery':
        this.selectedIndex = 2;
        break;
      case 'Delivered': 
        this.selectedIndex = 3;
        break;
    }
  }
}
