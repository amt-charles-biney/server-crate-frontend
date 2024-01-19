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
import { AttributeModalComponent } from '../../../attribute-modal/attribute-modal.component';
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
  deleteMultipleAttributes,
  resetAttributeCreation,
} from '../../../../store/category-management/attributes/attributes.actions';

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
  ],
  templateUrl: './attributes.component.html',
  styleUrl: './attributes.component.scss',
})
export class AttributesComponent implements OnInit, AfterViewInit {
  private attributes$ = new BehaviorSubject<Attribute[]>([]);
  attributes = this.attributes$.asObservable();
  attributesTodelete: Set<string> = new Set();
  localAttributes!: Attribute[]
  indeterminateCheckbox!: HTMLInputElement;
  selectForm!: FormGroup;
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
    const someValuesSelected = Object.values(this.selectForm.value).some(
      (value) => value
    );
    if (someValuesSelected) {
      this.clearSelected();
    } else {
      Object.keys(this.selectForm.value).forEach((value) => {
        this.selectForm.patchValue({ [value]: true });
      });
      this.localAttributes.map((attr) => {
        this.itemSelected({ name: '', isAdded: false, value: '' }, attr.id);
      });
      this.indeterminateCheckbox.indeterminate = true;
    }
    this.indeterminateCheckbox.checked = false;
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
    this.indeterminateCheckbox.indeterminate = Object.values(
      this.selectForm.value
    ).some((value) => value);
  }

  deleteAttributes() {
    const deleteList = Array.from(this.attributesTodelete);
    this.store.dispatch(deleteAll({ deleteList }));

    this.attributesTodelete.clear();
    this.indeterminateCheckbox.indeterminate = false;
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
