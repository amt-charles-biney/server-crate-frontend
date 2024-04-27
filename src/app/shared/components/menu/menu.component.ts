import { Component, DestroyRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { MenuItemComponent } from '../menu-item/menu-item.component';
import { Store } from '@ngrx/store';
import { Select } from '../../../types';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { selectCategoriesState } from '../../../store/admin/products/categories.reducers';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth/auth.service';
import { UserOptionsComponent } from '../user-options/user-options.component';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [MenuItemComponent, RouterLink, UserOptionsComponent],
  templateUrl: './menu.component.html',
})
export class MenuComponent implements OnInit, OnChanges {
  @Input() menuIsOpen!: boolean;
  @Output() closeMenuEmitter = new EventEmitter<boolean>();
  localMenuIsOpen = this.menuIsOpen
  isAuthenticated!: boolean
  menu: Record<string, Select[]> = {
    Categories: [],
    Case: [],
    Brand: [],
  };

  menuItemSelected = '';

  constructor(private store: Store, private destroyRef: DestroyRef, private authService: AuthService) {}
  ngOnInit(): void {
    this.localMenuIsOpen = this.menuIsOpen
    this.isAuthenticated = this.authService.isAuthenticated()
    this.store
      .select(selectCategoriesState)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((state) => {
        this.menu['Case'] = state.cases;
        this.menu['Categories'] = state.categories;
        this.menu['Brand'] = state.brands;
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes['menuIsOpen']) {
      this.localMenuIsOpen = changes['menuIsOpen'].currentValue;
    }
  }

  hideOtherMenuItems(selectedMenuName: string) {
    this.menuItemSelected = selectedMenuName;
  }


  closeMenu() {
    this.localMenuIsOpen = false;
    this.closeMenuEmitter.emit()
  }
}
