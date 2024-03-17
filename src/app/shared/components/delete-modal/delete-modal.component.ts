import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { deleteCategoriesAndConfig } from '../../../store/category-management/attributes/config/config.actions';
import { deleteCase } from '../../../store/case/case.actions';

@Component({
  selector: 'app-delete-modal',
  standalone: true,
  imports: [],
  templateUrl: './delete-modal.component.html',
})
export class DeleteModalComponent {
  constructor(
    public dialogRef: MatDialogRef<DeleteModalComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      deleteList: string[];
      text: string;
      isCategory: boolean;
      caseName?: string;
    },
    private store: Store
  ) {}

  deleteCategories() {
    if (this.data.isCategory) {
      this.store.dispatch(
        deleteCategoriesAndConfig({ deleteList: this.data.deleteList })
      );
    } else {
      this.store.dispatch(deleteCase({ id: this.data.deleteList[0] }));
    }
    this.dialogRef.close(true);
  }
}
