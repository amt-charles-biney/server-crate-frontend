import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-custom-select',
  standalone: true,
  imports: [MatSelectModule, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './custom-select.component.html',
  styleUrl: './custom-select.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomSelectComponent implements OnInit{
  @Input() control!: FormControl;
  @Input() options!: any;
  @Input() label = '';
  @Input() noMargin = false
  @Input() placeholder: string = 'Select an option';
  @Input() isMultipleSelect = false;
  @Input() isDisabled = false;
  @Input() isRequired = false;
  @Output() onSelect = new EventEmitter<MatSelectChange>();
ngOnInit(): void {
  console.log('Control', this.control.touched);
  
}
  select(event: MatSelectChange) {
    this.onSelect.emit(event);
  }
  compareFn(c1: string  , c2: string): boolean {    
    if (c1 && c2) {
      return c1 !== c2;
    }
    return false
  }
}
