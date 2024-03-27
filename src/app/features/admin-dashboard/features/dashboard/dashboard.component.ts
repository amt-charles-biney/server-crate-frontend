import { Component, OnInit } from '@angular/core';
import { LOCALSTORAGE_USER } from '../../../../core/utils/constants';
import { Dashboard, Username } from '../../../../types';
import { DashboardCardComponent } from '../../../../shared/components/dashboard-card/dashboard-card.component';
import { Store } from '@ngrx/store';
import { getDashboardData } from '../../../../store/dashboard/dashboard.actions';
import { BehaviorSubject } from 'rxjs';
import { selectDashboardData, selectDashboardState } from '../../../../store/dashboard/dashboard.reducers';
import { CommonModule } from '@angular/common';
import { ChartComponent } from '../../../../shared/components/chart/chart.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [DashboardCardComponent, CommonModule, ChartComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  name!: string
  private dashboardData$ = new BehaviorSubject<Dashboard | null>(null)
  dashboardData = this.dashboardData$.asObservable()

  constructor(private store: Store) {}
  ngOnInit(): void {
    this.store.dispatch(getDashboardData())
    const user: Username = JSON.parse(localStorage.getItem(LOCALSTORAGE_USER)!)
    this.name = `${user.firstName} ${user.lastName}`

    this.dashboardData = this.store.select(selectDashboardData)
  }

}
