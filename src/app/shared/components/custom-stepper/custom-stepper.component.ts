import { CdkStepper, CdkStepperModule } from '@angular/cdk/stepper';
import { CommonModule, NgTemplateOutlet } from '@angular/common';
import { Component, ContentChildren, Input, QueryList } from '@angular/core';
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
export class CustomStepperComponent extends CdkStepper{

  @Input() completed!: boolean;
  @Input() price!: number
  selectStepByIndex(index: number): void {    
    this.selectedIndex = index;
  }
}
