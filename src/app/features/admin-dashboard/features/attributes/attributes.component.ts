import { AttributeInputService } from './../../../../core/services/product/attribute-input.service';
import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CustomCheckBoxComponent } from '../../../../shared/components/custom-check-box/custom-check-box.component';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Attr } from '../../../../types';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import { AttributeModalComponent } from '../../../attribute-modal/attribute-modal.component';

@Component({
  selector: 'app-attributes',
  standalone: true,
  imports: [
    CommonModule,
    CustomCheckBoxComponent,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule
  ],
  templateUrl: './attributes.component.html',
  styleUrl: './attributes.component.scss',
})
export class AttributesComponent implements OnInit, AfterViewInit {
  attributes!: Attr[];
  selectForm!: FormGroup;
  attributesTodelete: Set<string> = new Set()
  indeterminateCheckbox!: HTMLInputElement
  @ViewChild(CustomCheckBoxComponent) check!: CustomCheckBoxComponent;
  constructor(private attrService: AttributeInputService, public dialog: MatDialog) {}
  ngOnInit(): void {
    this.onInit();
  }

  ngAfterViewInit(): void {
    this.indeterminateCheckbox = this.check.inputState.nativeElement
    this.check.inputState.nativeElement.className = 'indeterminateCheckbox'
  }
  onInit() {
    this.attributes = [
      {
        attributeName: 'Operating System',
        attributeType: ['Windows 11', 'Windows 7', 'Windows 10', 'Windows 8'],
      },
      {
        attributeName: 'Memory',
        attributeType: ['16GB DDR4', '32GB DDR4', '64GB DDR4'],
      },
      {
        attributeName: 'Case',
        attributeType: ['Server case', 'Server case', 'Server case'],
      },
      {
        attributeName: 'Motherboard',
        attributeType: ['Assus Turf', 'NVIDIA RTX'],
      },
    ];
    this.selectForm = this.attrService.toSelectFormGroup(this.attributes);
    this.openDialog()
  }
  removeCheck() {
    const someValuesSelected = Object.values(this.selectForm.value).some(
      (value) => value
    );
    if (someValuesSelected) {
      this.onInit();
    } else {
      Object.keys(this.selectForm.value).forEach((value) => {
        this.selectForm.patchValue({ [value]: true });
      });
      this.indeterminateCheckbox.indeterminate = true;
    }
    this.indeterminateCheckbox.checked = false;
  }
  itemSelected(selected: { name: string; value: string; isAdded: boolean }) {
    if (this.attributesTodelete.has(selected.name)) {
      this.attributesTodelete.delete(selected.name)
    } else {
      this.attributesTodelete.add(selected.name)
    }
    this.indeterminateCheckbox.indeterminate = Object.values(
      this.selectForm.value
    ).some((value) => value);
  }

  deleteAttributes() {
    this.attributes = this.attributes.filter((value) => !this.attributesTodelete.has(value.attributeName))
    this.indeterminateCheckbox.indeterminate = false
  }

  openDialog() {
    const dialogRef = this.dialog.open(AttributeModalComponent, {
      height: '80%',
      width: '50%'
    });

  }
}
