import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Attribute, AttributeOption } from '../../../types';
import { Store } from '@ngrx/store';
import { deleteAttributeOption, resetAttributeCreation } from '../../../store/category-management/attributes/attributes.actions';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { AttributeModalComponent } from '../../../features/admin-dashboard/features/attributes/features/attribute-modal/attribute-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { CloudinaryUrlPipe } from '../../pipes/cloudinary-url/cloudinary-url.pipe';

@Component({
  selector: 'app-variant-options',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, CloudinaryUrlPipe],
  templateUrl: './variant-options.component.html',
})
export class VariantOptionsComponent implements OnInit {
  @Input() attributeOptions!: AttributeOption[];
  @Input() attribute!: Attribute;
  @Input() isMeasured!: boolean;
  @Output() editOption = new EventEmitter<Attribute>();
  optionMedia!: any
  constructor(private store: Store, private dialog: MatDialog) {}
ngOnInit(): void {
  this.optionMedia = this.attribute
}
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
