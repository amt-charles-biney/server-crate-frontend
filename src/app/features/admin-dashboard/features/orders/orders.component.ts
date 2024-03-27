import { FormControl, FormGroup } from '@angular/forms';
import { AfterViewInit, ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { CustomSelectComponent } from '../../../../shared/components/custom-select/custom-select.component';
import { AllOrders, ShippingStatus } from '../../../../types';

import { CustomCheckBoxComponent } from '../../../../shared/components/custom-check-box/custom-check-box.component';
import { Store } from '@ngrx/store';
import {
  deleteAllAdminOrders,
  getAdminOrders,
  getUserOrders,
} from '../../../../store/orders/order.actions';
import { Subject, tap } from 'rxjs';
import { selectOrdersState } from '../../../../store/orders/order.reducers';
import { AttributeInputService } from '../../../../core/services/product/attribute-input.service';
import { CommonModule } from '@angular/common';
import { OrderRowComponent } from '../../../../shared/components/order-row/order-row.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatSelectChange } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { DatePickerComponent } from '../../../../shared/components/date-picker/date-picker.component';
@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [
    CustomSelectComponent,
    CustomCheckBoxComponent,
    CommonModule,
    OrderRowComponent,
    NgxPaginationModule,
    DatePickerComponent
  ],
  templateUrl: './orders.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrdersComponent implements OnInit, AfterViewInit {
  @ViewChild(CustomCheckBoxComponent) check!: CustomCheckBoxComponent;
  toggleCheckbox = false;
  selectForm!: FormGroup;
  indeterminateCheckbox!: HTMLInputElement;
  ordersTodelete: Set<string> = new Set();
  private orders$ = new Subject<AllOrders>();
  orders = this.orders$.asObservable();

  filter: FormControl = new FormControl<keyof typeof ShippingStatus>('All');
  navigateTo!: string
  page: number = 1;

  isAdmin!: boolean

  constructor(
    private store: Store,
    private inputService: AttributeInputService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService
  ) {
  }
  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin()
    
    if (this.isAdmin) {
      this.navigateTo = '/admin/orders'
      console.log('Get admin orders');
    } else {
      this.navigateTo = '/settings/orders'
      console.log('Get user orders')
    }
    this.orders = this.store.select(selectOrdersState).pipe(
      tap((data) => {
        if (this.isAdmin) {
          this.selectForm = this.inputService.toSelectFormGroup(data.content);
        }
      })
    );

    this.activatedRoute.queryParams.subscribe((params) => {
      if (params['status']) {
        this.filter.patchValue(params['status'])
      }
     
      if (this.isAdmin) {
        this.store.dispatch(getAdminOrders({ params }))
        console.log('Admin');
        
      } else {
        this.store.dispatch(getUserOrders({ params }))
        console.log('User');
      }
    });
  }
  ngAfterViewInit(): void {
    if (this.check) {
      this.indeterminateCheckbox = this.check.inputState.nativeElement;
      this.check.inputState.nativeElement.className = 'indeterminateCheckbox';
    }
  }

  getPage(pageNumber: number) {
    this.page = pageNumber;
    document.body.scrollTo({ top: 0, behavior: 'smooth' });
  }

  filterBy(event: MatSelectChange) {
    
    this.router.navigate([this.navigateTo], {
      queryParams: { status: event.value },
      queryParamsHandling: 'merge',
      replaceUrl: true
    });
  }

  removeCheck() {
    this.toggleCheckbox = !this.toggleCheckbox;
    Object.keys(this.selectForm.value).forEach((value) => {
      this.selectForm.patchValue({ [value]: this.toggleCheckbox });
    });
    const someValuesSelected = Object.values(this.selectForm.value).some(
      (value) => value
    );
    const allSelected = Object.values(this.selectForm.value).every(
      (value) => value
    );

    if (allSelected) {
      this.indeterminateCheckbox.checked = true;
      this.check.inputState.nativeElement.className = '';
      this.indeterminateCheckbox.indeterminate = false;
    } else if (someValuesSelected) {
      this.clearSelected();
      this.check.inputState.nativeElement.className = 'indeterminateCheckbox';
    } else {
      this.clearSelected();
    }
  }

  /**
   * Clears the list of ids to be deleted
   */
  clearSelected() {
    Object.keys(this.selectForm.value).forEach((value) => {
      this.selectForm.patchValue({ [value]: false });
    });
    this.ordersTodelete.clear();
  }
  itemSelected(
    selected: { name: string; value: string; isAdded: boolean },
    id: string
  ) {
    if (this.ordersTodelete.has(id)) {
      this.ordersTodelete.delete(id);
    } else {
      this.ordersTodelete.add(id);
    }
    const allSelected = Object.values(this.selectForm.value).every(
      (value) => value
    );
    const someSelected = Object.values(this.selectForm.value).some(
      (value) => value
    );

    if (allSelected) {
      this.indeterminateCheckbox.checked = true;
      this.indeterminateCheckbox.indeterminate = false;
      this.check.inputState.nativeElement.className = '';
    } else if (someSelected) {
      this.check.inputState.nativeElement.className = 'indeterminateCheckbox';
      this.indeterminateCheckbox.indeterminate = true;
    } else {
      this.indeterminateCheckbox.indeterminate = false;
      this.check.inputState.nativeElement.className = 'indeterminateCheckbox';
    }
  }

  /**
   * Gathers the order ids to be deleted
   * @returns {void}
   */
  deleteOrders(): void {
    const deleteList = Array.from(this.ordersTodelete);
    if (deleteList.length === 0) {
      return;
    }
    this.store.dispatch(deleteAllAdminOrders({ deleteList }));
    this.ordersTodelete.clear();
    this.indeterminateCheckbox.indeterminate = false;
    this.indeterminateCheckbox.checked = false;
    this.toggleCheckbox = false;
  }


  getToDate(toDate: Date) {
    this.router.navigate([this.navigateTo], {
      queryParams: { endDate: new Date(toDate).toISOString().split('T')[0] },
      queryParamsHandling: 'merge',
      replaceUrl: true,
      relativeTo: this.activatedRoute
    });
  }

  getFromDate(fromDate: Date) {
    this.router.navigate([this.navigateTo], {
      queryParams: { startDate: new Date(fromDate).toISOString().split('T')[0] },
      queryParamsHandling: 'merge',
      replaceUrl: true,
      relativeTo: this.activatedRoute
    });
  }
}
