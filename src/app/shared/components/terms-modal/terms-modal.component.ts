import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TermsAndConditionsComponent } from '../terms-and-conditions/terms-and-conditions.component';

@Component({
  selector: 'app-terms-modal',
  standalone: true,
  imports: [MatDialogModule, TermsAndConditionsComponent],
  templateUrl: './terms-modal.component.html',
  styleUrl: './terms-modal.component.scss'
})
export class TermsModalComponent {
  constructor(public termsModalRef: MatDialogRef<TermsModalComponent>){}

  acceptTerms() {
    this.termsModalRef.close(true)
  }
  
  declineTerms() {
    this.termsModalRef.close(false)
  }
}
