import { AfterViewInit, Component, ElementRef, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Chart, ChartItem } from 'chart.js/auto';
import { getChartData } from '../../../store/dashboard/dashboard.actions';
import { BehaviorSubject, tap } from 'rxjs';
import { ChartData } from '../../../types';
import { selectChartData } from '../../../store/dashboard/dashboard.reducers';
import { CommonModule } from '@angular/common';
import { DatePickerComponent } from '../date-picker/date-picker.component';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [CommonModule, DatePickerComponent],
  templateUrl: './chart.component.html',
})
export class ChartComponent implements OnInit, AfterViewInit {
  chart: any;
  chartRef!: ChartItem;

  navigateTo = '/admin/dashboard'

  toDate!: Date;
  fromDate!: Date;

  private chartData$ = new BehaviorSubject<ChartData>({
    dayOfWeeks: [],
    revenue: [],
  });
  chartData = this.chartData$.asObservable();
  constructor(
    private store: Store,
    private elementRef: ElementRef,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    Chart.defaults.plugins.legend.display = false
    this.activatedRoute.queryParams.subscribe((params) => {      
      this.store.dispatch(getChartData({ params }));
    })
    
  }

  ngAfterViewInit(): void {
    this.chartData = this.store.select(selectChartData).pipe(
      tap((chartData) => {
        if (chartData.dayOfWeeks.length > 0) {
          this.createChart(chartData.dayOfWeeks, chartData.revenue);
        }
      })
    );
  }

  createChart(daysOfWeek: string[], revenue: number[]) {
    if (this.chartRef !== undefined) {
      Chart.getChart('revenueChart')?.destroy();
    }
    const newDaysOfWeek = daysOfWeek.map((day) => day[0].concat(day.slice(1, 3).toLowerCase()))
    this.chartRef = this.elementRef.nativeElement
      .querySelector('#revenueChart')
      .getContext('2d');
    this.chart = new Chart(this.chartRef, {
      type: 'line', //this denotes tha type of chart

      data: {
        // values on X-Axis
        labels: newDaysOfWeek,
        datasets: [
          {
            data: revenue,
            tension: 0.5,
          },
        ],
      },
      options: {
        maintainAspectRatio: true,
        aspectRatio: 2.5,
        scales: {
          x: {
            grid: {
              display: false
            }
          },
        }
      },
    });
  }

  getRange(dates: Record<string, Date>) {
    const params = {  startDate: new Date(dates['fromDate']).toISOString().split('T')[0], endDate: new Date(dates['toDate']).toISOString().split('T')[0]}
    this.router.navigate([this.navigateTo], {
      queryParams: params,
      queryParamsHandling: 'merge',
      replaceUrl: true,
      relativeTo: this.activatedRoute,
    });
  }
}
