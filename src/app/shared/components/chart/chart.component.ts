import { AfterViewInit, Component, ElementRef, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Chart } from 'chart.js/auto';
import { getChartData } from '../../../store/dashboard/dashboard.actions';
import { BehaviorSubject, tap } from 'rxjs';
import { ChartData } from '../../../types';
import { selectChartData } from '../../../store/dashboard/dashboard.reducers';
import { CommonModule } from '@angular/common';
import { DatePickerComponent } from '../date-picker/date-picker.component';
@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [CommonModule, DatePickerComponent],
  templateUrl: './chart.component.html',
})
export class ChartComponent implements OnInit, AfterViewInit {
  chart: any
  chartRef!: any;

  private chartData$ = new BehaviorSubject<ChartData>({ dayOfWeeks: [], revenue: []});
  chartData = this.chartData$.asObservable()
  constructor(private store: Store, private elementRef: ElementRef) {}

  ngOnInit(): void {
    this.store.dispatch(getChartData())
  }

  ngAfterViewInit(): void {
    this.chartData = this.store.select(selectChartData).pipe(
      tap((chartData) => {
        if (chartData.dayOfWeeks.length > 0) {
          this.createChart(chartData.dayOfWeeks, chartData.revenue)
        }
      })
    )
  }

  createChart(daysOfWeek: string[], revenue: number[]){
    if (this.chartRef !== undefined) {
      Chart.getChart("revenueChart")?.destroy()
    }
    this.chartRef = this.elementRef.nativeElement.querySelector('#revenueChart').getContext('2d')
    this.chart = new Chart(this.chartRef, {
      type: 'line', //this denotes tha type of chart

      data: {// values on X-Axis
        labels: daysOfWeek, 
	      datasets: [
          {
            label: 'Revenue',
            data: revenue,
            tension: 0.5,
          }
        ],
      },
      options: {
        maintainAspectRatio: true,
        aspectRatio: 2.5,
      },

    });
  }
}
