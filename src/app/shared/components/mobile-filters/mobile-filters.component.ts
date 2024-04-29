import { AfterViewInit, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FilterTableComponent } from '../filter-table/filter-table.component';

@Component({
  selector: 'app-mobile-filters',
  standalone: true,
  imports: [FilterTableComponent],
  templateUrl: './mobile-filters.component.html',
})
export class MobileFiltersComponent {
  @ViewChild(FilterTableComponent) filterTable!: FilterTableComponent
  @Input() menuIsVisible!: boolean
  @Input() numberOfResults!: number
  @Output() closeMenuEmitter = new EventEmitter()
  
  closeFilterMenu() {
    this.closeMenuEmitter.emit()
  }

  clearAllFilters() {
    this.filterTable.clearFilters()
  }
}
