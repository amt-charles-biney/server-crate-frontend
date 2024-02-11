import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { deleteCategoriesAndConfig } from '../../../store/category-management/attributes/config/config.actions';

@Component({
  selector: 'app-delete-modal',
  standalone: true,
  imports: [],
  templateUrl: './delete-modal.component.html',
})
export class DeleteModalComponent {
  constructor(
    public dialogRef: MatDialogRef<DeleteModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { deleteList: string[] },
    private store: Store
  ) {}

  deleteCategories() {
    this.store.dispatch(deleteCategoriesAndConfig({ deleteList: this.data.deleteList }))
    this.dialogRef.close(true)
  }
}
