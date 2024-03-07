import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  addCase,
  deleteCase,
  getCases,
  getSingleCase,
  gotCases,
  gotSingleCase,
  updateCase,
} from './case.actions';
import { catchError, exhaustMap, finalize, map, of, switchMap, tap } from 'rxjs';
import { AdminService } from '../../core/services/admin/admin.service';
import { Case, CaseResponse } from '../../types';
import { setLoadingSpinner } from '../loader/actions/loader.actions';
import { errorHandler } from '../../core/utils/helpers';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class CaseEffect {
  gotCases$ = createEffect(() => {
    return this.action$.pipe(
      ofType(getCases),
      exhaustMap(() => {
        return this.adminService.getCases().pipe(
          map((response: CaseResponse) => {
            return gotCases({ cases: response });
          })
        );
      })
    );
  });

  getCase$ = createEffect(() => {
    return this.action$.pipe(
      ofType(getSingleCase),
      switchMap(({ id }) => {
        this.ngxService.startLoader('case')
        return this.adminService.getCase(id).pipe(
          map((data: Case) => {
            return gotSingleCase(data);
          }),
          catchError((err) => {
            return of(
              setLoadingSpinner({
                isError: true,
                message: errorHandler(err),
                status: false,
              })
            );
          }),
          finalize(() => {
            this.ngxService.stopLoader('case')
          })
        );
      })
    );
  });
  deleteCase$ = createEffect(() => {
    return this.action$.pipe(
      ofType(deleteCase),
      exhaustMap(({ id }) => {
        this.ngxService.startLoader('case')
        return this.adminService.deleteCase(id).pipe(
          map(() => {
            setTimeout(() => {
              this.router.navigateByUrl('/admin/case-management');
            }, 500);
            return getCases();
          }),
          catchError((err) => {
            return of(
              setLoadingSpinner({
                isError: true,
                message: errorHandler(err),
                status: false,
              })
            );
          }),
          finalize(() => {
            this.ngxService.stopLoader('case')
          })
        );
      })
    );
  });

  addCase$ = createEffect(() => {
    return this.action$.pipe(
      ofType(addCase),
      exhaustMap(({ formData }) => {
        this.ngxService.startLoader('case')
        return this.adminService.addCase({ formData }).pipe(
          map(() => {
            setTimeout(() => {
              this.router.navigateByUrl('/admin/case-management');
            }, 500);
            return getCases();
          }),
          catchError((err) => {
            this.toast.error(errorHandler(err), 'Error')
            return of();
          }),
          finalize(() => {
            this.ngxService.stopLoader('case')
          })
        );
      })
    );
  });

  updateCase$ = createEffect(() => {
    return this.action$.pipe(
      ofType(updateCase),
      exhaustMap(({ formData, id }) => {
        this.ngxService.startLoader('case')
        return this.adminService.updateCase({ formData, id }).pipe(
          map(() => {
            setTimeout(() => {
              this.router.navigateByUrl('/admin/case-management');
            }, 500);
            return getCases();
          }),
          catchError((err) => {
            this.toast.error(errorHandler(err), 'Error')
            return of();
          }),
          finalize(() => {
            this.ngxService.stopLoader('case')
          })
        );
      })
    );
  });

  constructor(
    private action$: Actions,
    private adminService: AdminService,
    private router: Router,
    private ngxService: NgxUiLoaderService,
    private toast: ToastrService
  ) {}
}
