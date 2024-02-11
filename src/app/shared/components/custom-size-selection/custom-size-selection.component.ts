import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Observable, map, startWith } from 'rxjs';
import { Attribute } from '../../../types';

@Component({
  selector: 'app-custom-size-selection',
  standalone: true,
  imports: [MatAutocompleteModule, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './custom-size-selection.component.html',
  styleUrl: './custom-size-selection.component.scss'
})
export class CustomSizeSelectionComponent implements OnInit, OnChanges {
  @Input() options: string[] = []
  @Input() control!: FormControl
  @Input() attribute!: Attribute
  @Input() isDisabled = false
  @Output() selectionEmitter = new EventEmitter<MatAutocompleteSelectedEvent>()
  filteredOptions!: Observable<string[]>;

  ngOnInit() {    
    this.filteredOptions = this.control.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.isDisabled) {
      this.control.disable()
      this.control.reset()
    } else {
      this.control.enable()
    }
  }

  private _filter(value: string | number): string[] {
    let filterValue: string | number
    if (typeof value === 'string') {
      filterValue = value.toLowerCase();
    } else if (typeof value === 'number') {
      filterValue = value.toString()
    }
    return this.options.filter(option => option.toLowerCase().includes(filterValue.toString()));
  }

  sizeSelection(event: MatAutocompleteSelectedEvent) {
    this.selectionEmitter.emit(event)
  }
}
