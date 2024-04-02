import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { CustomInputComponent } from '../custom-input/custom-input.component';

@Component({
  selector: 'app-reason-modal',
  standalone: true,
  imports: [ReactiveFormsModule, CustomInputComponent],
  templateUrl: './reason-modal.component.html',
})
export class ReasonModalComponent implements OnInit {
  reasonForm!: FormGroup

  constructor(public dialogRef: MatDialogRef<ReasonModalComponent>) {}

  ngOnInit(): void {
    this.reasonForm = new FormGroup({
      reason: new FormControl('', Validators.required)
    })
  }
}
