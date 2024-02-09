import { Component, OnInit } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { COOKIE_ACCEPTANCE } from '../../core/utils/constants';

@Component({
  selector: 'app-cookie-consent',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cookie-consent.component.html',
  styleUrl: './cookie-consent.component.scss',
  animations: [
    trigger('slideInBottom', [
      transition(':enter', [
        style({ transform: 'translateY(100%)' }),
        animate('300ms ease-out', style({ transform: 'translateY(0)' })),
      ]),
      transition(':leave', [
        animate('300ms ease-out', style({ transform: 'translateY(100%)' })),
      ]),
    ]),
  ],
})
export class CookieConsentComponent implements OnInit {
  isCookiePolicyAccepted = false;
  ngOnInit(): void {
    this.isCookiePolicyAccepted =
      localStorage.getItem(COOKIE_ACCEPTANCE) === 'true' ? true : false;
  }
  removeCookie() {
    this.isCookiePolicyAccepted = true;
    localStorage.setItem(COOKIE_ACCEPTANCE, 'true');
  }
}
