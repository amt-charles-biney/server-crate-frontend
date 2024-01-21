import {
  AfterViewInit,
  Component,
  DestroyRef,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
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
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { CustomCheckBoxComponent } from '../../../../shared/components/custom-check-box/custom-check-box.component';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { putBackAttributeOptionInStore, removeAttributeOptionInStore } from '../../../../store/category-management/attributes/attributes.actions';

@Component({
  selector: 'app-add-category',
  standalone: true,
  imports: [
    CustomInputComponent,
    CommonModule,
    CustomInputComponent,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    CustomCheckBoxComponent,
    MatSelectModule,
    MatFormFieldModule,
  ],
  templateUrl: './add-category.component.html',
  styleUrl: './add-category.component.scss',
})
export class AddCategoryComponent implements OnInit, AfterViewInit {
  private attributes$ = new BehaviorSubject<Attribute[]>([]);
  private selectedAttribute$ = new BehaviorSubject<AttributeOption[]>([]);
  selectedAttributes = this.selectedAttribute$.asObservable();
  attributes = this.attributes$.asObservable();
  categoryForm!: FormGroup;
  localAttributes!: Attribute[];
  makeLeftButtonGreen = true;
  makeRightButtonGreen = false;
  isOverflow = false;
  
  @ViewChild('contentWrapper') contentWrapper!: ElementRef<HTMLDivElement>;
  incompatibleAttributes: Record<string, Set<AttributeOption>> = {
    // 'Operating Sysytem': new Set([
    //   {
    //     optionName: 'Windows 8',
    //     additionalInfo: { baseAmount: 0, maxAmount: 0, priceFactor: 0 },
    //     attribute: { id: '', isMeasured: true, name: 'Operating Sysytem' },
    //     id: '',
    //     optionMedia: '',
    //     optionPrice: 0,
    //   },
    //   {
    //     optionName: 'Simmtronics PC1600',
    //     additionalInfo: { baseAmount: 0, maxAmount: 0, priceFactor: 0 },
    //     attribute: { id: '', isMeasured: true, name: 'Operating Sysytem' },
    //     id: '',
    //     optionMedia: '',
    //     optionPrice: 0,
    //   },
    // ]),
    // 'Memory': new Set([
    //   {
    //     optionName: 'DDR4',
    //     additionalInfo: { baseAmount: 0, maxAmount: 0, priceFactor: 0 },
    //     attribute: { id: '', isMeasured: true, name: 'Operating Sysytem' },
    //     id: '',
    //     optionMedia: '',
    //     optionPrice: 0,
    //   },
    // ]),
    // 'Rainbow': new Set([
    //   {
    //     optionName: 'DDR4',
    //     additionalInfo: { baseAmount: 0, maxAmount: 0, priceFactor: 0 },
    //     attribute: { id: '', isMeasured: true, name: 'Operating Sysytem' },
    //     id: '',
    //     optionMedia: '',
    //     optionPrice: 0,
    //   },
    // ]),
    // 'Stars': new Set([
    //   {
    //     optionName: 'DDR4',
    //     additionalInfo: { baseAmount: 0, maxAmount: 0, priceFactor: 0 },
    //     attribute: { id: '', isMeasured: true, name: 'Operating Sysytem' },
    //     id: '',
    //     optionMedia: '',
    //     optionPrice: 0,
    //   },
    // ]),
    // 'Storage': new Set([
    //   {
    //     optionName: 'DDR4',
    //     additionalInfo: { baseAmount: 0, maxAmount: 0, priceFactor: 0 },
    //     attribute: { id: '', isMeasured: true, name: 'Operating Sysytem' },
    //     id: '',
    //     optionMedia: '',
    //     optionPrice: 0,
    //   },
    //   {
    //     optionName: 'DDR4',
    //     additionalInfo: { baseAmount: 0, maxAmount: 0, priceFactor: 0 },
    //     attribute: { id: '', isMeasured: true, name: 'Operating Sysytem' },
    //     id: '',
    //     optionMedia: '',
    //     optionPrice: 0,
    //   },
    // ]),
    // 'War': new Set([
    //   {
    //     optionName: 'DDR4',
    //     additionalInfo: { baseAmount: 0, maxAmount: 0, priceFactor: 0 },
    //     attribute: { id: '', isMeasured: true, name: 'Operating Sysytem' },
    //     id: '',
    //     optionMedia: '',
    //     optionPrice: 0,
    //   },
    //   {
    //     optionName: 'DDR4',
    //     additionalInfo: { baseAmount: 0, maxAmount: 0, priceFactor: 0 },
    //     attribute: { id: '', isMeasured: true, name: 'Operating Sysytem' },
    //     id: '',
    //     optionMedia: '',
    //     optionPrice: 0,
    //   },
    // ]),
    // 'GPU': new Set([
    //   {
    //     optionName: 'DDR4',
    //     additionalInfo: { baseAmount: 0, maxAmount: 0, priceFactor: 0 },
    //     attribute: { id: '', isMeasured: true, name: 'Operating Sysytem' },
    //     id: '',
    //     optionMedia: '',
    //     optionPrice: 0,
    //   },
    //   {
    //     optionName: 'DDR4',
    //     additionalInfo: { baseAmount: 0, maxAmount: 0, priceFactor: 0 },
    //     attribute: { id: '', isMeasured: true, name: 'Operating Sysytem' },
    //     id: '',
    //     optionMedia: '',
    //     optionPrice: 0,
    //   },
    //   {
    //     optionName: 'DDR4',
    //     additionalInfo: { baseAmount: 0, maxAmount: 0, priceFactor: 0 },
    //     attribute: { id: '', isMeasured: true, name: 'Operating Sysytem' },
    //     id: '',
    //     optionMedia: '',
    //     optionPrice: 0,
    //   },
    // ]),
  };
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
        this.localAttributes = attrs;
      });
  }

  ngAfterViewInit(): void {
    console.log('Content wrapper', this.contentWrapper.nativeElement);

  }
  onSelect(value: Event) {
    this.selectedAttribute$.next(this.categoryForm.value.attributesInput);
    console.log(this.categoryForm.value['attributesInput']);
    console.log(value.target);
  }

  sideScroll(
    element: HTMLDivElement,
    speed: number,
    distance: number,
    step: number
  ) {
    let scrollAmount = 0;

    const slideTimer = setInterval(() => {
      element.scrollLeft += step;
      scrollAmount += Math.abs(step);
      if (scrollAmount >= distance) {
        clearInterval(slideTimer);
      }
    }, speed);
    // Finished scrolling right
    if (element.scrollLeft + element.offsetWidth + 2 >= element.scrollWidth) {
      this.makeLeftButtonGreen = false;
    } else {
      this.makeLeftButtonGreen = true;
    }
    // Finished scrolling right
    if (element.scrollLeft > 0) {
      this.makeRightButtonGreen = true;
    } else {
      this.makeRightButtonGreen = false;
    }
    console.log(
      'scrollwidth',
      element.scrollWidth,
      'scrollLeft',
      element.scrollLeft,
      'offsetWidth',
      element.offsetWidth
    );
  }

  displayFn(option: Attribute): string {
    console.log('displayed', option.attributeName);
    return option && option.attributeName ? option.attributeName : '';
  }
  variantDisplay(option: AttributeOption): string {
    console.log('displayed', option.optionName);
    return option && option.optionName ? option.optionName : '';
  }
  optionSelected(event: MatAutocompleteSelectedEvent) {
    console.log(event.option.value);
    this.selectedAttribute$.next(event.option.value.attributeOptions);
  }
  variantSelected(event: MatAutocompleteSelectedEvent) {
    console.log(event.option.value.variantOptions);
  }
  isOverflown(element: HTMLElement) {
    return element.scrollWidth > element.clientWidth;
  }
  removeAttributeOption(option: AttributeOption, incompatibleAttributes:  Record<string, Set<AttributeOption>>) {
    const name = option.attribute.name
    let remainingAttributeOptions = incompatibleAttributes[name].delete(option)
    this.store.dispatch(putBackAttributeOptionInStore(option))
    if (incompatibleAttributes[name].size === 0) {
      delete incompatibleAttributes[name]
    }
    console.log(this.incompatibleAttributes);
    
    return remainingAttributeOptions
  }
  
  addAttribute() {
    console.log(this.categoryForm.get('variants')?.value);
    const element = this.contentWrapper.nativeElement
    const attribute = this.categoryForm.get('variants')
      ?.value as AttributeOption[];
    this.incompatibleAttributes = {
      ...this.incompatibleAttributes,
      ...this.buildIncompatibleTable(attribute),
    };
    this.isOverflow = !(
      element.scrollWidth ===
      element.offsetWidth
    );
    console.log(this.isOverflow, 'client');
    if ((element.offsetHeight < element.scrollHeight) || (element.offsetWidth < element.scrollWidth)) {
      console.log('OVERFLOW');
    }
    console.log(this.isOverflown(this.contentWrapper.nativeElement));
  }
  buildIncompatibleTable(
    incompatibles: AttributeOption[]
  ): Record<string, Set<AttributeOption>> {
    const incompatibleSet: Record<string, Set<AttributeOption>> = {};
    incompatibles.forEach((incompatibleAttribute) => {
      if (incompatibleSet[incompatibleAttribute.attribute.name]) {
        incompatibleSet[incompatibleAttribute.attribute.name].add(
          incompatibleAttribute
        );
      } else {
        incompatibleSet[incompatibleAttribute.attribute.name] = new Set([
          incompatibleAttribute,
        ]);
      }
      this.store.dispatch(removeAttributeOptionInStore(incompatibleAttribute))
    });
    return incompatibleSet;
  }
  get attributesInput() {
    return this.categoryForm.get('attributesInput')!;
  }
}
