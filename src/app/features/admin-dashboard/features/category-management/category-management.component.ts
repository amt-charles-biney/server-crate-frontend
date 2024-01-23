import { RouterModule } from '@angular/router';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { CustomCheckBoxComponent } from '../../../../shared/components/custom-check-box/custom-check-box.component';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { getCategoriesAndConfig } from '../../../../store/category-management/attributes/config/config.actions';
import { BehaviorSubject, tap } from 'rxjs';
import { CategoryAndConfig } from '../../../../types';
import { selectCategoryAndConfigState } from '../../../../store/category-management/attributes/config/config.reducers';
import { CommonModule } from '@angular/common';
import { AttributeInputService } from '../../../../core/services/product/attribute-input.service';
import { MatMenuModule } from '@angular/material/menu';
import { ViewChildren, QueryList } from '@angular/core';
@Component({
  selector: 'app-category-management',
  standalone: true,
  imports: [
    RouterModule,
    CustomCheckBoxComponent,
    CommonModule,
    CustomCheckBoxComponent,
    FormsModule,
    ReactiveFormsModule,
    MatMenuModule
  ],
  templateUrl: './category-management.component.html',
  styleUrl: './category-management.component.scss',
})
export class CategoryManagementComponent implements OnInit, AfterViewInit {
  selectForm!: FormGroup;
  @ViewChild(CustomCheckBoxComponent) check!: CustomCheckBoxComponent;
  categoriesAndConfig$ = new BehaviorSubject<CategoryAndConfig[]>([]);
  categoriesAndConfig = this.categoriesAndConfig$.asObservable();
  categoriesTodelete: Set<string> = new Set();
  localAttributes!: CategoryAndConfig[];
  indeterminateCheckbox!: HTMLInputElement;

  constructor(
    private store: Store,
    private inputService: AttributeInputService
  ) {}
  ngOnInit(): void {
    this.store.dispatch(getCategoriesAndConfig());
    this.categoriesAndConfig = this.store
      .select(selectCategoryAndConfigState)
      .pipe(
        tap((attrs) => {
          this.selectForm = this.inputService.toSelectFormGroup(attrs);
          this.localAttributes = attrs;
        })
      );
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
    this.categoriesTodelete.clear();
  }
  itemSelected(
    selected: { name: string; value: string; isAdded: boolean },
    id: string
  ) {
    if (this.categoriesTodelete.has(id)) {
      this.categoriesTodelete.delete(id);
    } else {
      this.categoriesTodelete.add(id);
    }
    this.indeterminateCheckbox.indeterminate = Object.values(
      this.selectForm.value
    ).some((value) => value);
  }
  editCategory(id: string) {
    console.log('Edit', id);
  }
  showCategoryInfo(id: string) {
    console.log('view', id)
  }
}
