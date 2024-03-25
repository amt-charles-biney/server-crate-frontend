import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { getCustomers } from '../../../../store/customers/customers.actions';
import { BehaviorSubject } from 'rxjs';
import { CustomerData, Customers } from '../../../../types';
import { selectContent, selectCustomersState } from '../../../../store/customers/customers.reducers';
import { CommonModule } from '@angular/common';
import { PaginatedComponent } from '../../../../shared/components/paginated/paginated.component';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [CommonModule, PaginatedComponent, NgxPaginationModule],
  templateUrl: './customers.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomersComponent implements OnInit{
  private customers$ = new BehaviorSubject<Customers>({
    content: [],
    size: 0,
    totalElements: 0,
    totalPages: 0
  })
  page!: number
  customers = this.customers$.asObservable()
  constructor(private store: Store) {}
  ngOnInit(): void {
   this.store.dispatch(getCustomers())
   this.customers = this.store.select(selectCustomersState)
  }
}
