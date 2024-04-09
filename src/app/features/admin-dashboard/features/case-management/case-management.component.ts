import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Case } from '../../../../types';
import { BehaviorSubject, Observable } from 'rxjs';
import { NgxPaginationModule } from 'ngx-pagination';
import { Store } from '@ngrx/store';
import { getCases } from '../../../../store/case/case.actions';
import { selectContent, selectTotalElements } from '../../../../store/case/case.reducers';
import { RouterModule } from '@angular/router';
import { CaseItemComponent } from '../../../../shared/components/case-item/case-item.component';
import { PaginatedComponent } from '../../../../shared/components/paginated/paginated.component';

@Component({
  selector: 'app-case-management',
  standalone: true,
  imports: [CommonModule, NgxPaginationModule, RouterModule, CaseItemComponent, PaginatedComponent],
  templateUrl: './case-management.component.html',
})
export class CaseManagementComponent implements OnInit {
  private cases$ = new BehaviorSubject<Case[]>([]);
  cases: Observable<Case[]> = this.cases$.asObservable();
  total!: Observable<number>;
  page: number = 1;
  constructor(private store: Store) {}

  ngOnInit(): void {
    this.getPage(1)
  }
  
  getPage(pageNumber: number) {
    this.page = pageNumber;
    this.store.dispatch(getCases({ page: pageNumber - 1}));
    document.body.scrollTo({ top: 0, behavior: 'smooth'})
    this.cases = this.store.select(selectContent);
    this.total = this.store.select(selectTotalElements)
  }
}
