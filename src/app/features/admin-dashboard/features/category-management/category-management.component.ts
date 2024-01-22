import { Component, OnInit, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CustomCheckBoxComponent } from '../../../../shared/components/custom-check-box/custom-check-box.component';
import { FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { getCategories } from '../../../../store/admin/products/categories.actions';

@Component({
  selector: 'app-category-management',
  standalone: true,
  imports: [RouterModule, CustomCheckBoxComponent],
  templateUrl: './category-management.component.html',
  styleUrl: './category-management.component.scss'
})
export class CategoryManagementComponent implements OnInit{
  selectForm!: FormGroup
  @ViewChild(CustomCheckBoxComponent) check!: CustomCheckBoxComponent;

  constructor(private store: Store) {}
  ngOnInit(): void {
    this.store.dispatch(getCategories())
  }
}
