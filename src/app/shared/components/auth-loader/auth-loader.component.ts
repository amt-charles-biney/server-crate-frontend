import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { LoadingStatus } from '../../../types';

@Component({
  selector: 'app-auth-loader',
  standalone: true,
  imports: [CommonModule, ],
  templateUrl: './auth-loader.component.html',
  styleUrl: './auth-loader.component.scss'
})
export class AuthLoaderComponent {
  @Input() loadingState!: Observable<LoadingStatus>
}
