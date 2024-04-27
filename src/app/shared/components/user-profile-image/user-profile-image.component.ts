import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProfileService } from '../../../core/services/user-profile/profile.service';
import { Observable } from 'rxjs';
import { Username } from '../../../types';
import { MatMenuModule } from '@angular/material/menu';
import { UserOptionsComponent } from '../user-options/user-options.component';

@Component({
  selector: 'app-user-profile-image',
  standalone: true,
  imports: [CommonModule, MatMenuModule, UserOptionsComponent],
  templateUrl: './user-profile-image.component.html',
  styleUrl: './user-profile-image.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserProfileImageComponent implements OnInit {
  @Input() smaller!: boolean
  initials$!: Observable<Username>
  constructor(private profileService: ProfileService) {}
  
  ngOnInit(): void {
    this.initials$ = this.profileService.getUser()
  }  
}
