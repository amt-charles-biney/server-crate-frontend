import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ProfileService } from '../../../core/services/user-profile/profile.service';
import { Observable } from 'rxjs';
import { Username } from '../../../types';
import { MatMenuModule } from '@angular/material/menu';
import { logout } from '../../../core/utils/helpers';
import { AuthService } from '../../../core/services/auth/auth.service';

@Component({
  selector: 'app-user-profile-image',
  standalone: true,
  imports: [CommonModule, RouterModule, MatMenuModule],
  templateUrl: './user-profile-image.component.html',
  styleUrl: './user-profile-image.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserProfileImageComponent implements OnInit {
  @Input() smaller!: boolean
  initials$!: Observable<Username>
  @Output() adminLinkEmitter = new EventEmitter<string>()
  constructor(private profileService: ProfileService, private router: Router, private authService: AuthService) {}
  
  ngOnInit(): void {
    this.initials$ = this.profileService.getUser()
  }
  accountLogout = () => logout()
  
  navigateToSettings() {
    if (this.isAdmin()) {
      this.adminLinkEmitter.emit('Settings')
      if (this.router.url.includes('/settings/')) return
      this.router.navigateByUrl('/admin/settings/general')
      return
    }
    if (this.router.url.includes('/settings/')) return
    this.router.navigateByUrl('/settings/general')
  }
  navigateToDashboard() {
    this.adminLinkEmitter.emit('Dashboard')
    this.router.navigateByUrl('/admin/dashboard')
  }

  isAdmin() {
    return this.authService.isAdmin()
  }
}
