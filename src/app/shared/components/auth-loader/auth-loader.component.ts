import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject, combineLatest, map } from 'rxjs';
import { selectIsError, selectIsLoading, selectMessage } from '../../../store/signup/reducers/signup.reducers';

@Component({
  selector: 'app-auth-loader',
  standalone: true,
  imports: [CommonModule, ],
  templateUrl: './auth-loader.component.html',
  styleUrl: './auth-loader.component.scss'
})
export class AuthLoaderComponent {
  @Input() selectMessage!: any
  @Input() selectIsLoading!: any
  @Input() selectIsError!: any
  private loadingState$ = new Subject<{isLoading: boolean, isError: boolean, message: string}>();
  loadingState = this.loadingState$.asObservable();
  constructor(private store: Store) {
    this.loadingState = combineLatest(
      [this.store.select(selectMessage),
      this.store.select(selectIsLoading),
      this.store.select(selectIsError),
    ]
    ).pipe(map(([message, isLoading, isError]: [string, boolean, boolean]) => {
      return { isLoading, message, isError }
    }))
  }
}
