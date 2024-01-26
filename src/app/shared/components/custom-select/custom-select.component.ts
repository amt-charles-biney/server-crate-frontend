import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { AttributeOption } from '../../../types';

@Component({
  selector: 'app-custom-select',
  standalone: true,
  imports: [MatSelectModule, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './custom-select.component.html',
  styleUrl: './custom-select.component.scss',
})
export class CustomSelectComponent implements OnInit {
  @Input() control!: FormControl;
  @Input() options!: any;
  @Input() label = '';
  @Input() placeholder: string = 'Select an option';
  @Input() isMultipleSelect = false;
  @Input() isDisabled = false;
  @Output() onSelect = new EventEmitter<MatSelectChange>();

  ngOnInit(): void {
    // console.log('Select value', this.control.value);
  }
  select(event: MatSelectChange) {
    this.onSelect.emit(event);
  }
  compareFn(c1: AttributeOption | number , c2: AttributeOption | string | number): boolean {    
    console.log('c1', c2, 'c2', c2);
    if (c1 && c2) {
      if (typeof c1 === 'number' || typeof c2 === 'number') {
        return c1 === c2
      }
      if (typeof c2 === 'string') {
        return c1.optionName === c2
      }
      return c1.optionName === c2.optionName;
    }
    return false
  }
}
