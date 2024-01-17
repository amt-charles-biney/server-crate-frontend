import { Component, OnInit } from '@angular/core';
import { CustomInputComponent } from '../../../../shared/components/custom-input/custom-input.component';
import { Store } from '@ngrx/store';
import { getAttributes } from '../../../../store/category-management/category/category.actions';

@Component({
  selector: 'app-add-category',
  standalone: true,
  imports: [CustomInputComponent],
  templateUrl: './add-category.component.html',
  styleUrl: './add-category.component.scss'
})
export class AddCategoryComponent implements OnInit {
  constructor(private store: Store) {}
  ngOnInit(): void {
    this.store.dispatch(getAttributes())
  }
}
