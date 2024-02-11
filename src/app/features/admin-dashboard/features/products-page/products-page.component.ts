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
import { selectProducts, selectTotal } from '../../../../store/admin/products/products.reducers';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-products-page',
  standalone: true,
  imports: [
    ProductItemComponent,
    RouterModule,
    CommonModule,
    NgxPaginationModule,
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
    this.page = pageNumber;
    this.store.dispatch(getProducts({ page: this.page - 1 }));
    this.products = this.store.select(selectProducts);
    this.total = this.store.select(selectTotal)
  }
}
