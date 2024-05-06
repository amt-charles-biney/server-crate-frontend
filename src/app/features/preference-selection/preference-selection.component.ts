import { Store } from '@ngrx/store';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ProductItem } from '../../types';
import { NgxPaginationModule } from 'ngx-pagination';
import { CommonModule } from '@angular/common';
import {
  selectCallState,
  selectContent,
  selectTotalElements,
} from '../../store/admin/products/products.reducers';
import { UserProductItemComponent } from '../../shared/components/user-product-item/user-product-item.component';
import { filter } from '../../store/users/users.actions';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MobileFiltersComponent } from '../../shared/components/mobile-filters/mobile-filters.component';
import { FilterTableComponent } from '../../shared/components/filter-table/filter-table.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { getCallState } from '../../core/utils/helpers';

@Component({
  selector: 'app-preference-selection',
  standalone: true,
  imports: [
    CommonModule,
    NgxPaginationModule,
    UserProductItemComponent,
    MobileFiltersComponent,
    FilterTableComponent,
    MatProgressSpinnerModule,
  ],
  templateUrl: './preference-selection.component.html',
})
export class PreferenceSelectionComponent implements OnInit {
  @Input() id!: string;
  @Input() maxSize!: number;
  @Output() pageChange: EventEmitter<number> = new EventEmitter<number>();
  @Output() pageBoundsCorrection: EventEmitter<number> =
    new EventEmitter<number>();
  @ViewChild(FilterTableComponent) filterTable!: FilterTableComponent;
  filtersMenuIsVisible = false;
  queryParams!: Record<string, Set<string>>;

  private products$ = new BehaviorSubject<ProductItem[]>([]);
  isLoading!: boolean;
  error!: string | null;
  callState$ = this.store.select(selectCallState).pipe(
    tap((callState) => {
      [this.isLoading, this.error] = getCallState(callState)
    })
  );
  products: Observable<ProductItem[]> = this.products$.asObservable();
  total!: Observable<number>;
  page: number = 0;
  
  search: string = '';
  isGridMode: boolean = true;
  includedBrand!: string;

  constructor(
    private store: Store,
    public dialog: MatDialog,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.products = this.store.select(selectContent);
    this.total = this.store.select(selectTotalElements);

    if (this.search) {
      this.store.dispatch(
        filter({
          page: 0,
          params: { query: this.search },
        })
      );
    }
  }
  getPage(pageNumber: number, search: string) {
    this.page = pageNumber;
    if (search) {
      this.store.dispatch(filter({ page: 0, params: { query: search } }));
    }
    this.products = this.store.select(selectContent);
    this.total = this.store.select(selectTotalElements);
  }

  openFiltersSideBar() {
    this.filtersMenuIsVisible = !this.filtersMenuIsVisible;
  }

  compareEvent() {
    this.router.navigateByUrl('/compare');
  }

  clearAllFilters() {
    this.filterTable.clearFilters();
  }
}
