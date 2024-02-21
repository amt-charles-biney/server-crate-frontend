import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Attribute, AttributeOption } from '../../../types';
import { Store } from '@ngrx/store';
import { deleteAttributeOption, resetAttributeCreation } from '../../../store/category-management/attributes/attributes.actions';
import { CommonModule } from '@angular/common';
import { AttributeModalComponent } from '../../../features/admin-dashboard/features/attributes/features/attribute-modal/attribute-modal.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-variant-options',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './variant-options.component.html',
})
export class VariantOptionsComponent {
  @Input() attributeOptions!: AttributeOption[];
  @Input() attribute!: Attribute;
  @Input() isMeasured!: boolean;
  @Output() editOption = new EventEmitter<Attribute>();
  constructor(private store: Store, private dialog: MatDialog) {}

  deleteOption(optionId: string) {
    this.store.dispatch(deleteAttributeOption({ optionId, attributeId: this.attribute.id }));
  }

  edit() {
    this.editOption.emit(this.attribute);
  }

  openModal(index: number) {
    const info = {
      attribute: this.attribute,
      index
    }
    const dialogRef = this.dialog.open(AttributeModalComponent, {
      height: '80%',
      width: '70%',
      data: info
    });
    dialogRef.afterClosed().subscribe(() => {
      this.store.dispatch(resetAttributeCreation());
    });
  }
}
