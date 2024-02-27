import { Component, Input, OnInit } from '@angular/core';
import { Case } from '../../../types';
import { CurrencyPipe, NgOptimizedImage } from '@angular/common';
import { RouterModule } from '@angular/router';
import { removeCloudinaryBaseUrl } from '../../../core/utils/helpers';

@Component({
  selector: 'app-case-item',
  standalone: true,
  imports: [NgOptimizedImage, CurrencyPipe, RouterModule],
  templateUrl: './case-item.component.html',
  styleUrl: './case-item.component.scss'
})
export class CaseItemComponent implements OnInit {
  @Input() case!: Case
  coverImage!: string
  
  ngOnInit(): void {
    this.coverImage = removeCloudinaryBaseUrl(this.case.coverImageUrl)
  }
}
