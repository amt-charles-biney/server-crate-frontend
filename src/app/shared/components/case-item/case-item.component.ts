import { Component, Input } from '@angular/core';
import { Case } from '../../../types';
import { CurrencyPipe, NgOptimizedImage } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-case-item',
  standalone: true,
  imports: [NgOptimizedImage, CurrencyPipe, RouterModule],
  templateUrl: './case-item.component.html',
  styleUrl: './case-item.component.scss'
})
export class CaseItemComponent {
  @Input() case!: Case
}
