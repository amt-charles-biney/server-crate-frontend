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
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { Attribute, AttributeOption, CategoryConfig } from '../../../types';
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

@Component({
  selector: 'app-incompatibles',
  standalone: true,
  imports: [
    CdkAccordionModule,
    CommonModule,
    CustomSelectComponent,
    MatMenuModule,
  ],
  templateUrl: './incompatibles.component.html',
  styleUrl: './incompatibles.component.scss',
  animations: [
    trigger('collapse', [
      state('false', style({ height: '*', visibility: '*' })),
      state('true', style({ height: '0', visibility: 'hidden' })),
      transition('false => true', animate(300 + 'ms ease-in')),
      transition('true => false', animate(300 + 'ms ease-out')),
    ]),
  ],
})
export class IncompatiblesComponent implements OnInit {
  @Input() incompatibleAttributeOptions: AttributeOption[] = [];
  @Output() incompatibleVariantsEmitter = new EventEmitter<string[]>();
  private attributes$ = new BehaviorSubject<Attribute[]>([]);
  private selectedAttribute$ = new BehaviorSubject<AttributeOption[]>([]);
  attributes = this.attributes$.asObservable();
  selectedAttributes = this.selectedAttribute$.asObservable();
  localAttributes: Attribute[] = [];
  incompatibleSet: Record<string, AttributeOption[]> = {};
  numOfIncompatibles = 0;

  incompatibleForm!: FormGroup;
  collapsed = true;
  isOverflow = false;
  makeLeftButtonGreen = true;
  makeRightButtonGreen = false;

  incompatibleVariantsArray: string[] = [];
  @ViewChild('contentWrapper') contentWrapper!: ElementRef<HTMLDivElement>;

  constructor(private store: Store) {}
  ngOnInit(): void {
    this.incompatibleSet = generateIncompatibleSet(
      this.incompatibleAttributeOptions
    );
    this.numOfIncompatibles = getNumberOfIncompatibles(this.incompatibleSet)
    this.incompatibleForm = new FormGroup({
      attribute: new FormControl(''),
      attributeVariants: new FormControl(''),
    });
    this.attributes = this.store.select(selectAttributesState).pipe(
      tap((attrs) => {
        this.localAttributes = attrs;
        this.incompatibleAttributeOptions.forEach((attributeOption) => {
          this.localAttributes = removeFromLocalAttributes(
            this.localAttributes,
            attributeOption.id
          );
          this.incompatibleVariantsArray.push(attributeOption.id)
        });
      })
    );
  }

  toggle() {
    this.collapsed = !this.collapsed;
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
    this.incompatibleForm.patchValue({ attribute: '', attributeVariants: '' });
    this.incompatibleVariantsArray = [
      ...this.incompatibleVariantsArray,
      ...attributeVariants.map((incompatibleVariant) => incompatibleVariant.id),
    ];
    this.incompatibleVariantsEmitter.emit(this.incompatibleVariantsArray);
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
    this.localAttributes = putInLocalAttributes(
      this.localAttributes,
      attributeOption
    );
    this.numOfIncompatibles = getNumberOfIncompatibles(this.incompatibleSet);
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
