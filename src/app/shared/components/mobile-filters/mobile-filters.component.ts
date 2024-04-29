import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-mobile-filters',
  standalone: true,
  imports: [],
  templateUrl: './mobile-filters.component.html',
})
export class MobileFiltersComponent {
  @Input() menuIsVisible!: boolean
  @Output() closeMenuEmitter = new EventEmitter()
  
  closeFilterMenu() {
    this.closeMenuEmitter.emit()
  }
}
