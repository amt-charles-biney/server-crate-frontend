import { NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CustomButtonComponent } from '../../../shared/components/custom-button/custom-button.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NgOptimizedImage, RouterModule, CustomButtonComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  isAuthenticated!: boolean
  constructor(private authService: AuthService){
    this.isAuthenticated = this.authService.isAuthenticated()
  }
}