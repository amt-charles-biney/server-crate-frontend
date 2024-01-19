import { Component, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CustomCheckBoxComponent } from '../../../../shared/components/custom-check-box/custom-check-box.component';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-category-management',
  standalone: true,
  imports: [RouterModule, CustomCheckBoxComponent],
  templateUrl: './category-management.component.html',
  styleUrl: './category-management.component.scss'
})
export class CategoryManagementComponent {
  selectForm!: FormGroup
  @ViewChild(CustomCheckBoxComponent) check!: CustomCheckBoxComponent;

}
