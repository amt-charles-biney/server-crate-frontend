import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { ProductItemComponent } from '../../../../shared/components/product-item/product-item.component';
import { ProductItem } from '../../../../types';
import { Router, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { getProducts } from '../../../../store/admin/products/categories.actions';
import { BehaviorSubject, Observable } from 'rxjs';
import { selectContent, selectTotalElements } from '../../../../store/admin/products/products.reducers';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { PaginatedComponent } from '../../../../shared/components/paginated/paginated.component';

@Component({
  selector: 'app-products-page',
  standalone: true,
  imports: [
    ProductItemComponent,
    RouterModule,
    CommonModule,
    NgxPaginationModule,
    PaginatedComponent
  ],
  templateUrl: './products-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsPageComponent implements OnInit {
  @Input() id!: string;
  @Input() maxSize!: number;
  @Output() pageChange: EventEmitter<number> = new EventEmitter<number>();
  @Output() pageBoundsCorrection: EventEmitter<number>  = new EventEmitter<number>();

  private products$ = new BehaviorSubject<ProductItem[]>([]);
  products: Observable<ProductItem[]> = this.products$.asObservable();
  total!: Observable<number>
  page: number = 0;
  constructor(private store: Store) {}
  ngOnInit(): void {
    this.getPage(1);
  }

  getPage(pageNumber: number) {
    document.body.scrollTo({ top: 0, behavior: 'smooth'})
    this.page = pageNumber;
    this.store.dispatch(getProducts({ page: this.page - 1 }));
    this.products = this.store.select(selectContent);
    this.total = this.store.select(selectTotalElements)
  }
}
