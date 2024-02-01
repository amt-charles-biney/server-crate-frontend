import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { AttributeOption } from '../../../types';
import { isAttributeOption, isCategoryEditResponse } from '../../../core/utils/helpers';

@Component({
  selector: 'app-custom-select',
  standalone: true,
  imports: [MatSelectModule, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './custom-select.component.html',
  styleUrl: './custom-select.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomSelectComponent {
  @Input() control!: FormControl;
  @Input() options!: any;
  @Input() label = '';
  @Input() noMargin = false
  @Input() placeholder: string = 'Select an option';
  @Input() isMultipleSelect = false;
  @Input() isDisabled = false;
  @Input() isRequired = false;
  @Output() onSelect = new EventEmitter<MatSelectChange>();

  select(event: MatSelectChange) {
    this.onSelect.emit(event);
  }
  compareFn(c1: string | AttributeOption  , c2: string | AttributeOption ): boolean {            
    if (c1 && c2) {
      if (typeof c1 === 'string' && typeof c2 === 'string') {
        return c1 === c2;
      }
      else if ( isAttributeOption(c1) && isCategoryEditResponse(c2)) {        
        return c1.id === c2.attributeOptionId
      } else if (typeof c1 === 'string' && typeof c2 === 'number') {
        return parseInt(c1) === c2
      }
    }
    return false
  }
}
