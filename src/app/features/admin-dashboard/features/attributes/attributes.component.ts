import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  DestroyRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CustomCheckBoxComponent } from '../../../../shared/components/custom-check-box/custom-check-box.component';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AttributeModalComponent } from './features/attribute-modal/attribute-modal.component';
import { Store } from '@ngrx/store';
import { AttributeInputService } from '../../../../core/services/product/attribute-input.service';
import { Attribute } from '../../../../types';
import { selectAttributesState } from '../../../../store/category-management/attributes/attributes.reducers';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BehaviorSubject } from 'rxjs';
import { MatExpansionModule } from '@angular/material/expansion';
import { VariantOptionsComponent } from '../../../../shared/components/variant-options/variant-options.component';
import {
  deleteAll,
  deleteAttribute,
  resetAttributeCreation,
} from '../../../../store/category-management/attributes/attributes.actions';
import {CdkAccordionModule} from '@angular/cdk/accordion';
import { ExpandableComponent } from '../../../../shared/components/expandable/expandable.component';
@Component({
  selector: 'app-attributes',
  standalone: true,
  imports: [
    CommonModule,
    CustomCheckBoxComponent,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatExpansionModule,
    VariantOptionsComponent,
    CdkAccordionModule,
    ExpandableComponent
  ],
  templateUrl: './attributes.component.html',
})
export class AttributesComponent implements OnInit, AfterViewInit {
  private attributes$ = new BehaviorSubject<Attribute[]>([]);
  attributes = this.attributes$.asObservable();
  attributesTodelete: Set<string> = new Set();
  localAttributes!: Attribute[]
  indeterminateCheckbox!: HTMLInputElement;
  selectForm!: FormGroup;
  toggleCheckbox = false

  @ViewChild(CustomCheckBoxComponent) check!: CustomCheckBoxComponent;
  constructor(
    public dialog: MatDialog,
    private store: Store,
    private attrService: AttributeInputService,
    private destroyRef: DestroyRef
  ) {}
  ngOnInit(): void {
    this.attributes = this.store.select(selectAttributesState);
    this.attributes
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((attrs) => {
        this.selectForm = this.attrService.toSelectFormGroup(attrs);
        this.localAttributes = attrs
      });
  }

  ngAfterViewInit(): void {
    this.indeterminateCheckbox = this.check.inputState.nativeElement;
    this.check.inputState.nativeElement.className = 'indeterminateCheckbox';
  }

  removeCheck() {
    this.toggleCheckbox = !this.toggleCheckbox
    Object.keys(this.selectForm.value).forEach((value) => {
      this.selectForm.patchValue({ [value]: this.toggleCheckbox });
    });
    const someValuesSelected = Object.values(this.selectForm.value).some(
      (value) => value
    );
    const allSelected = Object.values(
      this.selectForm.value
    ).every((value) => value);

    if (allSelected) {
      this.indeterminateCheckbox.checked = true;
      this.check.inputState.nativeElement.className = ''
      this.indeterminateCheckbox.indeterminate = false

        this.localAttributes.map((attr) => {
        this.itemSelected({ name: '', isAdded: false, value: '' }, attr.id);
      });
    }
    else if (someValuesSelected) {
      this.clearSelected();
      this.check.inputState.nativeElement.className = 'indeterminateCheckbox'
    } else {
      this.clearSelected()
    }
    // else {
    //   this.localAttributes.map((attr) => {
    //     this.itemSelected({ name: '', isAdded: false, value: '' }, attr.id);
    //   });
    //   this.indeterminateCheckbox.indeterminate = true;
    // }
  }
  clearSelected() {
    Object.keys(this.selectForm.value).forEach((value) => {
      this.selectForm.patchValue({ [value]: false });
    });
    this.attributesTodelete.clear();
  }
  itemSelected(
    selected: { name: string; value: string; isAdded: boolean },
    id: string
  ) {
    if (this.attributesTodelete.has(id)) {
      this.attributesTodelete.delete(id);
    } else {
      this.attributesTodelete.add(id);
    }
    const allSelected = Object.values(
      this.selectForm.value
    ).every((value) => value);
    const someSelected = Object.values(
      this.selectForm.value
    ).some((value) => value);

    if (allSelected) {
      this.indeterminateCheckbox.checked = true
      this.indeterminateCheckbox.indeterminate = false
      this.check.inputState.nativeElement.className = ''
    } else if (someSelected) {
      this.check.inputState.nativeElement.className = 'indeterminateCheckbox'
      this.indeterminateCheckbox.indeterminate = true
    } else {
      this.indeterminateCheckbox.indeterminate = false
      this.check.inputState.nativeElement.className = 'indeterminateCheckbox'
    }    
  }

  deleteAttributes() {
    const deleteList = Array.from(this.attributesTodelete);
    if (deleteList.length === 0) {
      return
    }
    this.store.dispatch(deleteAll({ deleteList }));

    this.attributesTodelete.clear();
    this.indeterminateCheckbox.indeterminate = false;
  }

  deleteAttribute({ id }: { id: string }) {
    this.store.dispatch(deleteAttribute({attributeId: id }))
  }

  editOption(attribute: Attribute) {
    const dialogRef = this.dialog.open(AttributeModalComponent, {
      data: { attribute },
      height: '80%',
      width: '70%',
    });
    dialogRef.afterClosed().subscribe(() => {
      this.store.dispatch(resetAttributeCreation());
    });
  }

  openDialog() {
    const dialogRef = this.dialog.open(AttributeModalComponent, {
      height: '80%',
      width: '70%',
    });
    dialogRef.afterClosed().subscribe(() => {
      this.store.dispatch(resetAttributeCreation());
    });
  }
}
