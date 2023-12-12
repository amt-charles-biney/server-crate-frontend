import { Component } from '@angular/core';
import { MatTabsModule } from "@angular/material/tabs"
import { TermsAndConditionsComponent } from '../../shared/components/terms-and-conditions/terms-and-conditions.component';
@Component({
  selector: 'app-account-settings',
  standalone: true,
  imports: [MatTabsModule, TermsAndConditionsComponent],
  templateUrl: './account-settings.component.html',
  styleUrl: './account-settings.component.scss'
})
export class AccountSettingsComponent {
}
