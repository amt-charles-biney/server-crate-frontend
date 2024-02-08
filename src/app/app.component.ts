import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule, NavigationEnd, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { resetLoader } from './store/loader/actions/loader.actions';
import { environment } from '../environments/environment';
import { getCartItems } from './store/cart/cart.actions';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  constructor(private router: Router, private store: Store) {
    this.router.events.subscribe((ev) => {
      if (ev instanceof NavigationEnd) { 
        this.store.dispatch(resetLoader({isError: false, message: '', status: false }))
      }
    });
    console.log(environment.base_url, environment.production);
    
  }

  ngOnInit(): void {
    this.store.dispatch(getCartItems());
  }
}
