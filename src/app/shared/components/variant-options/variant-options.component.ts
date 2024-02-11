import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Attribute, AttributeOption } from '../../../types';
import { Store } from '@ngrx/store';
import { deleteAttributeOption } from '../../../store/category-management/attributes/attributes.actions';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-variant-options',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './variant-options.component.html',
})
export class VariantOptionsComponent {
  @Input() attributeOptions!: AttributeOption[];
  @Input() attribute!: Attribute;
  @Input() isMeasured!: boolean;
  @Output() editOption = new EventEmitter<Attribute>();
  constructor(private store: Store) {}

  deleteOption(optionId: string) {
    this.store.dispatch(deleteAttributeOption({ optionId, attributeId: this.attribute.id }));
  }

  edit() {
    this.editOption.emit(this.attribute);
  }
}
