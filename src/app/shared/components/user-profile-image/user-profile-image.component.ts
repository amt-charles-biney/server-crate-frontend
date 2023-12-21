import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-user-profile-image',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-profile-image.component.html',
  styleUrl: './user-profile-image.component.scss'
})
export class UserProfileImageComponent {
  @Input() smaller!: boolean
}
