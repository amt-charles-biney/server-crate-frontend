import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ProfileService } from '../../../core/services/user-profile/profile.service';
import { Observable } from 'rxjs';
import { Username } from '../../../types';
import { MatMenuModule } from '@angular/material/menu';
import { logout } from '../../../core/utils/helpers';
import { CURRENT_INDEX } from '../../../core/utils/constants';

@Component({
  selector: 'app-user-profile-image',
  standalone: true,
  imports: [CommonModule, RouterModule, MatMenuModule],
  templateUrl: './user-profile-image.component.html',
  styleUrl: './user-profile-image.component.scss'
})
export class UserProfileImageComponent implements OnInit {
  @Input() smaller!: boolean
  initials$!: Observable<Username>
  constructor(private profileService: ProfileService, private router: Router) {}
  
  ngOnInit(): void {
    this.initials$ = this.profileService.getUser()
  }
  accountLogout = () => logout()
  
  navigateToSettings() {
    if (this.router.url.includes('/settings/')) return
    this.router.navigateByUrl('/settings/general')
  }
}
