import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { CustomInputComponent } from '../custom-input/custom-input.component';
import { Store } from '@ngrx/store';
import { cancelShipment } from '../../../store/orders/order.actions';

@Component({
  selector: 'app-reason-modal',
  standalone: true,
  imports: [ReactiveFormsModule, CustomInputComponent, MatDialogModule],
  templateUrl: './reason-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReasonModalComponent implements OnInit {
  reasonForm!: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<ReasonModalComponent>,
    private store: Store,
    @Inject(MAT_DIALOG_DATA) public data: { id: string }
  ) {}

  ngOnInit(): void {
    this.reasonForm = new FormGroup({
      reason: new FormControl('', Validators.required),
    });
  }

  closeDialog() {
    this.dialogRef.close(false);
  }

  cancelShipment() {
    if (this.reasonForm.invalid) return;
    this.store.dispatch(
      cancelShipment({
        id: this.data.id,
        reason: this.reasonForm.value.reason,
        status: 'Cancelled',
      })
    );
    this.dialogRef.close(true);
  }
}
