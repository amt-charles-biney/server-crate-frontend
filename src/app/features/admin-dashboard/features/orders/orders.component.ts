import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { CustomSelectComponent } from '../../../../shared/components/custom-select/custom-select.component';
import { AllOrders, ShippingStatus } from '../../../../types';
import {
  MatDatepickerInputEvent,
  MatDatepickerModule,
} from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';

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
import { CommonModule, DatePipe } from '@angular/common';
import { OrderRowComponent } from '../../../../shared/components/order-row/order-row.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatSelectChange } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth/auth.service';
@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [
    CustomSelectComponent,
    CustomCheckBoxComponent,
    MatDatepickerModule,
    ReactiveFormsModule,
    CommonModule,
    OrderRowComponent,
    NgxPaginationModule,
    DatePipe,
    MatIconModule,
  ],
  templateUrl: './orders.component.html',
  providers: [provideNativeDateAdapter()],
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
  rangeDate!: FormGroup
  page: number = 1;

  constructor(
    private store: Store,
    private inputService: AttributeInputService,
    private domSanitizer: DomSanitizer,
    private matIconRegistry: MatIconRegistry,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService
  ) {
    this.matIconRegistry.addSvgIcon(
      'myDatePicker',
      this.domSanitizer.bypassSecurityTrustResourceUrl('/assets/datepicker.svg')
    );
  }
  ngOnInit(): void {
    this.rangeDate = new FormGroup({
      toDate: new FormControl(null),
      fromDate: new FormControl(null),
    });
    
    if (this.authService.isAdmin()) {
      this.navigateTo = '/admin/orders'
      console.log('Get admin orders');
    } else {
      this.navigateTo = '/settings/orders'
      console.log('Get user orders')
    }
    this.orders = this.store.select(selectOrdersState).pipe(
      tap((data) => {
        this.selectForm = this.inputService.toSelectFormGroup(data.content);
      })
    );

    this.activatedRoute.queryParams.subscribe((params) => {
      if (params['status']) {
        this.filter.patchValue(params['status'])
      }
      if (params['startDate']) {
        this.rangeDate.patchValue({ fromDate: params['startDate']})
      }
      if (params['endDate']) {
        this.rangeDate.patchValue({ toDate: params['endDate']})
      }
      if (this.authService.isAdmin()) {
        this.store.dispatch(getAdminOrders({ params }))
        console.log('Admin');
        
      } else {
        this.store.dispatch(getUserOrders({ params }))
        console.log('User');
      }
    });
  }
  ngAfterViewInit(): void {
    this.indeterminateCheckbox = this.check.inputState.nativeElement;
    this.check.inputState.nativeElement.className = 'indeterminateCheckbox';
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

  /**
   * This function sets the "to" date
   * @param date - Date selected from date picker
   * @returns {void}
   */
  onToDateChange(date: MatDatepickerInputEvent<Date>): void {
    this.rangeDate.patchValue({ toDate: date.value });
    if (date.value) {
      this.router.navigate([this.navigateTo], {
        queryParams: { endDate: new Date(date.value).toISOString().split('T')[0] },
        queryParamsHandling: 'merge',
        replaceUrl: true,
        relativeTo: this.activatedRoute

      });
    }
  }

  /**
   * This function sets the "from" date
   * @param date - Date selected from date picker
   * @returns {void}
   */
  onFromDateChange(date: MatDatepickerInputEvent<Date>): void {
    this.rangeDate.patchValue({ fromDate: date.value });
    if (date.value) {
      this.router.navigate([this.navigateTo], {
        queryParams: { startDate: new Date(date.value).toISOString().split('T')[0] },
        queryParamsHandling: 'merge',
        replaceUrl: true,
        relativeTo: this.activatedRoute
      });
    }
  }
}
