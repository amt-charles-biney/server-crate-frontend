import { RouterModule } from '@angular/router';
import { AfterViewInit, ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { CustomCheckBoxComponent } from '../../../../shared/components/custom-check-box/custom-check-box.component';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { getCategoriesAndConfig } from '../../../../store/category-management/attributes/config/config.actions';
import { BehaviorSubject, Observable, Subject, tap } from 'rxjs';
import { AllCategories, CategoryAndConfig } from '../../../../types';
import { selectCategoryAndConfigState, selectContent, selectTotalElements } from '../../../../store/category-management/attributes/config/config.reducers';
import { CommonModule } from '@angular/common';
import { AttributeInputService } from '../../../../core/services/product/attribute-input.service';
import { MatMenuModule } from '@angular/material/menu';
import { TableRowComponent } from '../../../../shared/components/table-row/table-row.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DeleteModalComponent } from '../../../../shared/components/delete-modal/delete-modal.component';
import { PaginatedComponent } from '../../../../shared/components/paginated/paginated.component';
import { NgxPaginationModule } from 'ngx-pagination';
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
    MatMenuModule,
    TableRowComponent,
    DeleteModalComponent,
    MatDialogModule,
    PaginatedComponent,
    NgxPaginationModule
  ],
  templateUrl: './category-management.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoryManagementComponent implements OnInit, AfterViewInit {
  selectForm!: FormGroup;
  @ViewChild(CustomCheckBoxComponent) check!: CustomCheckBoxComponent;
  private categoriesAndConfig$ = new Subject<AllCategories>();
  categoriesAndConfig = this.categoriesAndConfig$.asObservable();
  categoriesTodelete: Set<string> = new Set();
  localAttributes!: CategoryAndConfig[];
  indeterminateCheckbox!: HTMLInputElement;
  page: number = 1;
  toggleCheckbox = false;
  total!: Observable<number>

  constructor(
    private store: Store,
    private inputService: AttributeInputService,
    public dialog: MatDialog
  ) {}
  ngOnInit(): void {
    this.store.dispatch(getCategoriesAndConfig({ page: 0}));
    this.categoriesAndConfig = this.store
      .select(selectCategoryAndConfigState)
      .pipe(
        tap((attrs) => {
          this.selectForm = this.inputService.toSelectFormGroup(attrs.content);
          this.localAttributes = attrs.content;
        })
      );
  }
  ngAfterViewInit(): void {
    this.indeterminateCheckbox = this.check.inputState.nativeElement;
    this.check.inputState.nativeElement.className = 'indeterminateCheckbox';
  }

  getPage(pageNumber: number) {
    this.page = pageNumber;
    this.store.dispatch(getCategoriesAndConfig({ page: this.page - 1}));
    this.categoriesAndConfig = this.store
    .select(selectCategoryAndConfigState)
    .pipe(
      tap((attrs) => {
        this.selectForm = this.inputService.toSelectFormGroup(attrs.content);
        this.localAttributes = attrs.content;
      })
    );
    this.total = this.store.select(selectTotalElements)
    document.body.scrollTo({ top: 0, behavior: 'smooth'})
  }
  removeCheck() {
    this.toggleCheckbox = !this.toggleCheckbox;
    Object.keys(this.selectForm.value).forEach((value) => {
      this.selectForm.patchValue({ [value]: this.toggleCheckbox });
    });
    const someValuesSelected = Object.values(this.selectForm.value).some(
      (value) => value
    );
    const allSelected = Object.values(this.selectForm.value).every(
      (value) => value
    );

    if (allSelected) {
      this.indeterminateCheckbox.checked = true;
      this.check.inputState.nativeElement.className = '';
      this.indeterminateCheckbox.indeterminate = false;

      this.localAttributes.map((attr) => {
        this.itemSelected({ name: '', isAdded: false, value: '' }, attr.id);
      });
    } else if (someValuesSelected) {
      this.clearSelected();
      this.check.inputState.nativeElement.className = 'indeterminateCheckbox';
    } else {
      this.clearSelected();
    }
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
    const allSelected = Object.values(this.selectForm.value).every(
      (value) => value
    );
    const someSelected = Object.values(this.selectForm.value).some(
      (value) => value
    );

    if (allSelected) {
      this.indeterminateCheckbox.checked = true;
      this.indeterminateCheckbox.indeterminate = false;
      this.check.inputState.nativeElement.className = '';
    } else if (someSelected) {
      this.check.inputState.nativeElement.className = 'indeterminateCheckbox';
      this.indeterminateCheckbox.indeterminate = true;
    } else {
      this.indeterminateCheckbox.indeterminate = false;
      this.check.inputState.nativeElement.className = 'indeterminateCheckbox';
    }
  }
  deleteCategories() {
    const deleteList = Array.from(this.categoriesTodelete);
    if (deleteList.length === 0) {
      return;
    }
    const dialogRef = this.dialog.open(DeleteModalComponent, {
      data: {
        deleteList,
        isCategory: true,
        text: 'This category would be permanently deleted from the system.',
      },
    });
    // this.store.dispatch(deleteCategoriesAndConfig({ deleteList }));
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.categoriesTodelete.clear();
        this.indeterminateCheckbox.indeterminate = false;
        this.indeterminateCheckbox.checked = false;
        this.toggleCheckbox = false;
      }
    });
  }
}
