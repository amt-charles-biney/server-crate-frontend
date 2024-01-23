import { CdkAccordionModule } from '@angular/cdk/accordion';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CustomCheckBoxComponent } from '../custom-check-box/custom-check-box.component';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Attribute } from '../../../types';
import { VariantOptionsComponent } from '../variant-options/variant-options.component';
import { CommonModule } from '@angular/common';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-expandable',
  standalone: true,
  imports: [
    CdkAccordionModule,
    CustomCheckBoxComponent,
    FormsModule,
    ReactiveFormsModule,
    VariantOptionsComponent,
    CommonModule,
  ],
  templateUrl: './expandable.component.html',
  styleUrl: './expandable.component.scss',
  animations: [
    trigger('collapse', [
      state('false', style({ height: '*', visibility: '*' })),
      state('true', style({ height: '0', visibility: 'hidden' })),
      transition('false => true', animate(300 + 'ms ease-in')),
      transition('true => false', animate(300 + 'ms ease-out'))
    ])
  ]
})
export class ExpandableComponent {
  @Output() itemSelectedEmitter = new EventEmitter<{
    selected: { name: string; value: string; isAdded: boolean };
    id: string;
  }>();
  @Output() editEmitter = new EventEmitter<Attribute>();

  @Input() control!: FormControl;
  @Input() attribute!: Attribute;
  collapsed = true;

  itemSelected(
    selected: { name: string; value: string; isAdded: boolean },
    id: string
  ) {
    this.itemSelectedEmitter.emit({ selected, id });
  }
  editOption(attribute: Attribute) {
    this.editEmitter.emit(attribute);
  }

  toggle() {
    this.collapsed = !this.collapsed
  }
}
