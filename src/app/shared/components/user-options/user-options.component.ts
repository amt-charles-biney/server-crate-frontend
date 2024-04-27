import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { logout } from '../../../core/utils/helpers';
import { AuthService } from '../../../core/services/auth/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-options',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-options.component.html',
})
export class UserOptionsComponent implements OnInit {
  @Input() customClass!: string
  @Output() closeMenuEmitter = new EventEmitter()
  isAdmin!: boolean
  constructor(private router: Router, private authService: AuthService) {

  }

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin()
  }
  
  navigateToDashboard() {
    this.router.navigateByUrl('/admin/dashboard')
  }

  navigateToSettings() {
    if (this.isAdmin) {
      this.router.navigateByUrl('/admin/settings/general')
      return
    }
    this.router.navigateByUrl('/settings/general')    
    this.closeMenuEmitter.emit()
  }

  accountLogout = () => logout()

}
