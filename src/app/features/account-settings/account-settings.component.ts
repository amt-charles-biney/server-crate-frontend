import { Component } from '@angular/core';
import { MatTabsModule } from "@angular/material/tabs"

@Component({
  selector: 'app-account-settings',
  standalone: true,
  imports: [MatTabsModule],
  templateUrl: './account-settings.component.html',
  styleUrl: './account-settings.component.scss'
})
export class AccountSettingsComponent {
}
