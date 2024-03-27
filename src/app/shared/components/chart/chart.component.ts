import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Chart } from 'chart.js/auto';
import { getChartData } from '../../../store/dashboard/dashboard.actions';
import { BehaviorSubject, tap } from 'rxjs';
import { ChartData } from '../../../types';
import { selectChartData } from '../../../store/dashboard/dashboard.reducers';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chart.component.html',
})
export class ChartComponent implements OnInit {
  chart: any

  private chartData$ = new BehaviorSubject<ChartData>({ dayOfWeeks: [], revenue: []});
  chartData = this.chartData$.asObservable()
  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(getChartData())
    

    this.chartData = this.store.select(selectChartData).pipe(
      tap((chartData) => {
        this.createChart(chartData.dayOfWeeks, chartData.revenue)
      })
    )
  }

  createChart(daysOfWeek: string[], revenue: number[]){
  
    this.chart = new Chart("MyChart", {
      type: 'line', //this denotes tha type of chart

      data: {// values on X-Axis
        labels: daysOfWeek, 
	      datasets: [
          {
            label: 'Revenue',
            data: revenue,

          }
        ]
      },
      options: {
        aspectRatio:2.5
      }
      
    });
  }
}
