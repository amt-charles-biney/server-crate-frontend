import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { LOCALSTORAGE_USER } from '../../../../core/utils/constants';
import { Dashboard, Username } from '../../../../types';
import { DashboardCardComponent } from '../../../../shared/components/dashboard-card/dashboard-card.component';
import { Store } from '@ngrx/store';
import { getDashboardData } from '../../../../store/dashboard/dashboard.actions';
import { BehaviorSubject } from 'rxjs';
import {
  selectDashboardData,
} from '../../../../store/dashboard/dashboard.reducers';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ChartComponent } from '../../../../shared/components/chart/chart.component';
import { CloudinaryUrlPipe } from '../../../../shared/pipes/cloudinary-url/cloudinary-url.pipe';
import { ShippingStatusComponent } from '../../../../shared/components/shipping-status/shipping-status.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    DashboardCardComponent,
    CommonModule,
    ChartComponent,
    CloudinaryUrlPipe,
    NgOptimizedImage,
    ShippingStatusComponent
  ],
  templateUrl: './dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit {
  name!: string;
  private dashboardData$ = new BehaviorSubject<Dashboard | null>(null);
  dashboardData = this.dashboardData$.asObservable();

  constructor(private store: Store) {}
  ngOnInit(): void {
    this.store.dispatch(getDashboardData());
    const user: Username = JSON.parse(localStorage.getItem(LOCALSTORAGE_USER)!);
    this.name = `${user.firstName} ${user.lastName}`;

    this.dashboardData = this.store.select(selectDashboardData);
  }
}
