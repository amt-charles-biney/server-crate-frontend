import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-reset',
  standalone: true,
  imports: [
    RouterModule,
    NgOptimizedImage
  ],
  templateUrl: './reset.component.html',
  styleUrl: './reset.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResetComponent {

}
