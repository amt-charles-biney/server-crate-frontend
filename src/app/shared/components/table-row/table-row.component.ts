import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CategoryAndConfig } from '../../../types';
import { CustomCheckBoxComponent } from '../custom-check-box/custom-check-box.component';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HoverDirective } from '../../directives/hover.directive';

@Component({
  selector: 'app-table-row',
  standalone: true,
  imports: [
    CommonModule,
    CustomCheckBoxComponent,
    FormsModule,
    ReactiveFormsModule,
    HoverDirective
  ],
  templateUrl: './table-row.component.html',
})
export class TableRowComponent {
  @Input() category!: CategoryAndConfig;
  @Input() control!: FormControl;
  @Output() itemSelectedEmitter = new EventEmitter<{
    selected: { name: string; value: string; isAdded: boolean };
    id: string;
  }>();
  isMenuOpened: boolean = false;
  isHovered: boolean = false
  @Output() closeEvent = new EventEmitter<void>();
  constructor(private router: Router) {}
  closeCategoryInfo() {
    this.isMenuOpened = false;
    this.closeEvent.emit();
  }

  itemSelected(
    selected: { name: string; value: string; isAdded: boolean },
    id: string
  ) {
    this.itemSelectedEmitter.emit({ selected, id });
  }

  editCategory(id: string) {    
    this.router.navigateByUrl(`/admin/add-category/${id}`)
  }
  showCategoryInfo(id: string) {
    this.isMenuOpened = true;
  }
}
