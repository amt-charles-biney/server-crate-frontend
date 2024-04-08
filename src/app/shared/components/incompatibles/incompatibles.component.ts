import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { CdkAccordionModule } from '@angular/cdk/accordion';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { Attribute, AttributeOption } from '../../../types';
import { MatSelectChange } from '@angular/material/select';
import { CustomSelectComponent } from '../custom-select/custom-select.component';
import { Store } from '@ngrx/store';
import { selectAttributesState } from '../../../store/category-management/attributes/attributes.reducers';
import {
  buildIncompatibleTable,
  generateIncompatibleSet,
  getNumberOfIncompatibles,
  putInLocalAttributes,
  removeFromLocalAttributes,
} from '../../../core/utils/helpers';
import { FormControl, FormGroup } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-incompatibles',
  standalone: true,
  imports: [
    CdkAccordionModule,
    CommonModule,
    CustomSelectComponent,
    MatMenuModule,
    MatTooltipModule
  ],
  templateUrl: './incompatibles.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('collapse', [
      state('false', style({ height: '*', visibility: '*' })),
      state('true', style({ height: '0', visibility: 'hidden' })),
      transition('false => true', animate(300 + 'ms ease-in')),
      transition('true => false', animate(300 + 'ms ease-out')),
    ]),
  ],
})
export class IncompatiblesComponent implements OnInit, OnChanges {
  @Input() incompatibleAttributeOptions: AttributeOption[] = [];
  @Input() collapsedIndex!: number
  @Input() formId!: number;
  @Output() incompatibleVariantsEmitter = new EventEmitter<{
    index: number;
    variants: string[];
  }>();
  @Output() removalEmitter = new EventEmitter<{
    index: number;
    variants: string[];
  }>();
  private attributes$ = new BehaviorSubject<Attribute[]>([]);
  private selectedAttribute$ = new BehaviorSubject<AttributeOption[]>([]);
  attributes = this.attributes$.asObservable();
  selectedAttributes = this.selectedAttribute$.asObservable();
  localAttributes: Attribute[] = [];
  nonRequiredAttributes: Attribute[] = []
  incompatibleSet: Record<string, AttributeOption[]> = {};
  numOfIncompatibles = 0;

  incompatibleForm!: FormGroup;
  collapsed = true;
  isOverflow = false;
  makeLeftButtonGreen = true;
  makeRightButtonGreen = false;

  incompatibleVariantsArray: string[] = [];
  @ViewChild('contentWrapper') contentWrapper!: ElementRef<HTMLDivElement>;
  @ViewChild('parent') parent!: ElementRef<HTMLDivElement>;

  constructor(private store: Store, private changeDetectorRef: ChangeDetectorRef) {}
  ngOnInit(): void {
    this.collapsed = !(this.collapsedIndex === this.formId)    
    this.incompatibleSet = generateIncompatibleSet(
      this.incompatibleAttributeOptions
    );
    
    this.numOfIncompatibles = getNumberOfIncompatibles(this.incompatibleSet);
    this.incompatibleForm = new FormGroup({
      attribute: new FormControl(''),
      attributeVariants: new FormControl(''),
    });
    this.attributes = this.store.select(selectAttributesState).pipe(
      tap((attrs) => {
        this.localAttributes = attrs;
        this.nonRequiredAttributes = attrs.filter((attr) => !attr.isRequired)
        this.incompatibleAttributeOptions.forEach((attributeOption) => {
          this.localAttributes = removeFromLocalAttributes(
            this.localAttributes,
            attributeOption.id
          );
          this.incompatibleVariantsArray.push(attributeOption.id);
        });
      })
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    const incompatibleAttributeOptions: AttributeOption[] = changes['incompatibleAttributeOptions'].currentValue
    this.incompatibleSet = generateIncompatibleSet(incompatibleAttributeOptions)
    const incompatibles = incompatibleAttributeOptions.map((incompatibleVariant) => {
      this.localAttributes = removeFromLocalAttributes(
        this.localAttributes,
        incompatibleVariant.id
      );
      return incompatibleVariant.id
    })
    this.incompatibleVariantsArray = [
      ...this.incompatibleVariantsArray,
      ...incompatibles
    ];
    this.checkOverflow()
  }

  toggle() {
    this.collapsed = !this.collapsed;
  }

  isOverflown(): boolean {    
    return !!(this.contentWrapper.nativeElement.scrollWidth > this.parent.nativeElement.clientWidth)
  }

  onSelectChange(event: MatSelectChange) {
    this.selectedAttribute$.next(event.value.attributeOptions);
  }

  addIncompatibleAttributeOption(attributeVariants: AttributeOption[]) {
    const { incompatibleSet, localAttributes } = buildIncompatibleTable(
      attributeVariants,
      this.incompatibleSet,
      this.localAttributes
    );
    this.incompatibleSet = incompatibleSet;
    this.localAttributes = localAttributes;
    this.numOfIncompatibles = getNumberOfIncompatibles(this.incompatibleSet);
    this.selectedAttribute$.next([]);

    this.incompatibleVariantsArray = [
      ...this.incompatibleVariantsArray,
      ...attributeVariants.map((incompatibleVariant) => incompatibleVariant.id),
    ];
    this.incompatibleVariantsEmitter.emit({
      index: this.formId,
      variants: this.incompatibleVariantsArray,
    });
    this.incompatibleForm.patchValue({ attribute: '', attributeVariants: '' });
    this.checkOverflow()
  }
  removeAttributeOption(
    attributeOption: AttributeOption,
    options: AttributeOption[]
  ) {
    const newAttributeOptions = options.filter(
      (option) => option.id !== attributeOption.id
    );

    if (newAttributeOptions.length === 0) {
      delete this.incompatibleSet[attributeOption.attribute.name];
    } else {
      this.incompatibleSet[attributeOption.attribute.name] =
        newAttributeOptions;
    }

    this.incompatibleVariantsArray = this.incompatibleVariantsArray.filter(
      (option) => !option.includes(attributeOption.id)
    );
    this.incompatibleVariantsEmitter.emit({
      index: this.formId,
      variants: this.incompatibleVariantsArray,
    });
    this.localAttributes = putInLocalAttributes(
      this.localAttributes,
      attributeOption
    );
    this.numOfIncompatibles = getNumberOfIncompatibles(this.incompatibleSet);
    this.checkOverflow()
  }

  checkOverflow() {
    setTimeout(() => {
      
      this.isOverflow = this.isOverflown()
      this.changeDetectorRef.detectChanges()
    }, 0);
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
  }

  get attributeVariants() {
    return this.incompatibleForm.get('attributeVariants')!;
  }

  get attribute() {
    return this.incompatibleForm.get('attribute')!;
  }
}
