import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { CustomButtonComponent } from '../../../shared/components/custom-button/custom-button.component';
import { UserProfileImageComponent } from '../../../shared/components/user-profile-image/user-profile-image.component';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { filter, search } from '../../../store/users/users.actions';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    NgOptimizedImage,
    RouterModule,
    CustomButtonComponent,
    UserProfileImageComponent,
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  animations: [
    trigger('showSearch', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('.3s ease-in', style({ opacity: 1 })),
      ]),
      
    ]),
    trigger('hideSearch', [
      transition(':leave', [
        style({ opacity: 1 }),
        animate('.3s ease-in', style({ opacity: 0 })),
      ]),
    ]),
    trigger('openClose', [
      state('true', style({ height: '*' })),
      state('false', style({ height: '64px' })),
      transition('false <=> true', animate(200))
    ])
  ],
})
export class HeaderComponent implements OnInit {
  isAuthenticated!: boolean;
  showSearch: boolean = false;
  searchForm!: FormGroup
  constructor(private authService: AuthService, private store: Store, private router: Router) {
    this.isAuthenticated = this.authService.isAuthenticated();
  }
  ngOnInit(): void {
    this.searchForm = new FormGroup({
      searchValue: new FormControl('', Validators.required)
    })
  }

  openSearch() {
    this.showSearch = !this.showSearch;
  }

  search() {
    if (this.searchForm.invalid) return ;
    const params = `query=${this.searchValue.value}`
    this.router.navigateByUrl(`/servers/${params}`)
    this.store.dispatch(filter({ page: 0, params }))
  }

  get searchValue() {
    return this.searchForm.get('searchValue')!
  }
}
