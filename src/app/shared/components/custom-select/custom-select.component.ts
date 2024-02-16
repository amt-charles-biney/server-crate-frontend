import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatSelect,
  MatSelectChange,
  MatSelectModule,
} from '@angular/material/select';
import { AttributeOption } from '../../../types';
import {
  isAttributeOption,
  isCategoryEditResponse,
} from '../../../core/utils/helpers';
import { CustomCheckBoxComponent } from '../custom-check-box/custom-check-box.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOption } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-custom-select',
  standalone: true,
  imports: [
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    CustomCheckBoxComponent,
    MatCheckboxModule,
    MatFormFieldModule
  ],
  templateUrl: './custom-select.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomSelectComponent {
  @Input() control!: FormControl;
  @Input() options!: any;
  @Input() label = '';
  @Input() noMargin = false;
  @Input() placeholder: string = 'Select an option';
  @Input() isMultipleSelect = false;
  @Input() isDisabled = false;
  @Input() isRequired = false;
  @Input() myClass!: string
  @Output() onSelect = new EventEmitter<MatSelectChange>();
  @ViewChild('matSelect') matSelect!: MatSelect;
  allSelected = false;

  select(event: MatSelectChange) {
    this.onSelect.emit(event);
  }
  compareFn(
    c1: string | AttributeOption,
    c2: string | AttributeOption
  ): boolean {
    if (c1 && c2) {
      if (typeof c1 === 'string' && typeof c2 === 'string') {
        return c1 === c2;
      } else if (isAttributeOption(c1) && isCategoryEditResponse(c2)) {
        return c1.id === c2.attributeOptionId;
      } else if (typeof c1 === 'string' && typeof c2 === 'number') {
        return parseInt(c1) === c2;
      } else if (isAttributeOption(c1) && isAttributeOption(c2)) {
        return c1.id === c2.id;
      }
    }
    return false;
  }
  toggleAllSelection() {
    this.allSelected = !this.allSelected;
    if (this.allSelected) {
      this.matSelect.options.forEach((item: MatOption) => item.select());
    } else {
      this.matSelect.options.forEach((item: MatOption) => item.deselect());
    }
  }
  optionClick() {
    let newStatus = true;
    this.matSelect.options.forEach((item: MatOption) => {
      if (!item.selected) {
        newStatus = false;
      }
    });
    this.allSelected = newStatus;
  }
}
