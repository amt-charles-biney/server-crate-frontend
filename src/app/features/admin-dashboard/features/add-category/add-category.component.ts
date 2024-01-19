import { Component, DestroyRef, OnInit } from '@angular/core';
import { CustomInputComponent } from '../../../../shared/components/custom-input/custom-input.component';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Subject, tap } from 'rxjs';
import { Attribute, AttributeOption } from '../../../../types';
import { selectAttributesState } from '../../../../store/category-management/attributes/attributes.reducers';
import { CommonModule } from '@angular/common';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { AttributeInputService } from '../../../../core/services/product/attribute-input.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'app-add-category',
  standalone: true,
  imports: [
    CustomInputComponent,
    CommonModule,
    CustomInputComponent,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule
  ],
  templateUrl: './add-category.component.html',
  styleUrl: './add-category.component.scss',
})
export class AddCategoryComponent implements OnInit {
  private attributes$ = new BehaviorSubject<Attribute[]>([]);
  private selectedAttribute$ = new BehaviorSubject<AttributeOption[]>([])
  selectedAttributes = this.selectedAttribute$.asObservable()
  attributes = this.attributes$.asObservable();
  categoryForm!: FormGroup;
  localAttributes!: Attribute[]

  constructor(
    private store: Store,
    private attributeService: AttributeInputService,
    private destroyRef: DestroyRef,
    private fb: FormBuilder
  ) {}
  ngOnInit(): void {
    this.attributes = this.store.select(selectAttributesState);
    this.attributes
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((attrs) => {
        this.categoryForm = this.attributeService.toFormGroup(attrs);
        this.localAttributes = attrs
      });
    
  }
  onSelect(value: Event) {
    this.selectedAttribute$.next(this.categoryForm.value.attributesInput)
    console.log(this.categoryForm.value['attributesInput']);
    console.log(value.target);
    
  }

  displayFn(option: Attribute): string {
    console.log('displayed', option.attributeName);
    return option && option.attributeName ? option.attributeName : ''
  }
  variantDisplay(option: AttributeOption): string {
    console.log('displayed', option.optionName);
    return option && option.optionName ? option.optionName : ''
  }
  optionSelected(event: MatAutocompleteSelectedEvent) {
    console.log(event.option.value);
    this.selectedAttribute$.next(event.option.value.attributeOptions)
  }
  variantSelected(event: MatAutocompleteSelectedEvent) {
    console.log(event.option.value);
  }
  get attributesInput() {
    return this.categoryForm.get('attributesInput')!
  }

  
}
