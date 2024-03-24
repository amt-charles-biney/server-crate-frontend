import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { getCustomers } from '../../../../store/customers/customers.actions';
import { BehaviorSubject } from 'rxjs';
import { CustomerData } from '../../../../types';
import { selectContent } from '../../../../store/customers/customers.reducers';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.scss'
})
export class CustomersComponent implements OnInit{
  private customers$ = new BehaviorSubject<CustomerData[]>([])
  customers = this.customers$.asObservable()
  constructor(private store: Store) {}
  ngOnInit(): void {
   this.store.dispatch(getCustomers())
   this.customers = this.store.select(selectContent)
  }
}
