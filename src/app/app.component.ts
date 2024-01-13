import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule, NavigationEnd, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { resetLoader } from './store/loader/actions/loader.actions';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  constructor(private router: Router, private store: Store) {
    this.router.events.subscribe((ev) => {
      if (ev instanceof NavigationEnd) { 
        this.store.dispatch(resetLoader({isError: false, message: '', status: false }))
      }
    });
  }
}
