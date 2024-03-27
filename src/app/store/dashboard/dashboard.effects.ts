import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AdminService } from '../../core/services/admin/admin.service';
import { getChartData, getDashboardData, gotChartData, gotDashboardData } from './dashboard.actions';
import { EMPTY, catchError, exhaustMap, map } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { errorHandler } from '../../core/utils/helpers';
import { ChartData } from '../../types';

@Injectable()
export class DashboardEffect {
  getDashboardData$ = createEffect(() => {
    return this.action$.pipe(
      ofType(getDashboardData),
      exhaustMap(() => {
        return this.adminService.getDashboardData().pipe(
          map((data) => {
            return gotDashboardData(data);
          }),
          catchError((err) => {
            this.toast.error(errorHandler(err), 'Error');
            return EMPTY;
          })
        );
      })
    );
  });

  getChartData$ = createEffect(() => {
    return this.action$.pipe(
        ofType(getChartData),
        exhaustMap(({ params }) => {
            return this.adminService.getChartData(params).pipe(
                map((chartData) => {
                    return gotChartData(chartData)
                }),
                catchError((err) => {
                    this.toast.error(errorHandler(err), "Error")
                    return EMPTY
                })
            )
        })
    )
  })

  constructor(
    private adminService: AdminService,
    private action$: Actions,
    private toast: ToastrService
  ) {}
}
