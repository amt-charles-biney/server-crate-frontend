import { Component } from '@angular/core';
import { HeroComponent } from './features/hero/hero.component';
import { BannerComponent } from './features/banner/banner.component';
@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [HeroComponent, BannerComponent],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss'
})
export class LandingComponent {

}
