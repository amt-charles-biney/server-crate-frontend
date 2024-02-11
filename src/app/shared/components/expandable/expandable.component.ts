import { CdkAccordionModule } from '@angular/cdk/accordion';
import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { CustomCheckBoxComponent } from '../custom-check-box/custom-check-box.component';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Attribute } from '../../../types';
import { VariantOptionsComponent } from '../variant-options/variant-options.component';
import { CommonModule } from '@angular/common';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-expandable',
  standalone: true,
  imports: [
    CdkAccordionModule,
    CustomCheckBoxComponent,
    FormsModule,
    ReactiveFormsModule,
    VariantOptionsComponent,
    MatMenuModule,
    CommonModule,
  ],
  templateUrl: './expandable.component.html',
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
  @Output() deleteEmitter = new EventEmitter<{ id: string }>()
  @Input() control!: FormControl;
  @Input() attribute!: Attribute;
  collapsed = true;
  showChevron = false

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

  deleteAttribute(id: string ) {
    this.deleteEmitter.emit({ id })
  }

  @HostListener('mouseenter') onMouseEnter() {
    this.showChevron = true
  }
  @HostListener('mouseleave') onMouseLeave() {
    this.showChevron = false
  }
}
