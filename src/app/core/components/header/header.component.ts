import { NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NgOptimizedImage, RouterModule],
  templateUrl: './header.component.html',
})
export class HeaderComponent {

}
