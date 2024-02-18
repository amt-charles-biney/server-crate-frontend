import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Case } from '../../../../types';
import { BehaviorSubject, Observable } from 'rxjs';
import { NgxPaginationModule } from 'ngx-pagination';
import { Store } from '@ngrx/store';
import { getCases } from '../../../../store/case/case.actions';
import { selectCases, selectTotalCases } from '../../../../store/case/case.reducers';
import { RouterModule } from '@angular/router';
import { CaseItemComponent } from '../../../../shared/components/case-item/case-item.component';

@Component({
  selector: 'app-case-management',
  standalone: true,
  imports: [CommonModule, NgxPaginationModule, RouterModule, CaseItemComponent],
  templateUrl: './case-management.component.html',
})
export class CaseManagementComponent implements OnInit {
  private cases$ = new BehaviorSubject<Case[]>([]);
  cases: Observable<Case[]> = this.cases$.asObservable();
  total!: Observable<number>;
  page: number = 1;
  constructor(private store: Store) {}

  ngOnInit(): void {
    this.cases = this.store.select(selectCases);
    this.total = this.store.select(selectTotalCases)
  }

  getPage(pageNumber: number) {
    this.page = pageNumber;
    scrollTo({ top: 0, behavior: 'smooth'})
  }
}
