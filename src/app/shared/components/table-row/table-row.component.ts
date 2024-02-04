import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CategoryAndConfig } from '../../../types';
import { CustomCheckBoxComponent } from '../custom-check-box/custom-check-box.component';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClickOutsideDirective } from '../../directives/click-outside.directive';
import { Router } from '@angular/router';

@Component({
  selector: 'app-table-row',
  standalone: true,
  imports: [
    CommonModule,
    CustomCheckBoxComponent,
    FormsModule,
    ReactiveFormsModule,
    ClickOutsideDirective,
  ],
  templateUrl: './table-row.component.html',
  styleUrl: './table-row.component.scss',
})
export class TableRowComponent {
  @Input() category!: CategoryAndConfig;
  @Input() control!: FormControl;
  @Output() itemSelectedEmitter = new EventEmitter<{
    selected: { name: string; value: string; isAdded: boolean };
    id: string;
  }>();
  isMenuOpened: boolean = false;
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
