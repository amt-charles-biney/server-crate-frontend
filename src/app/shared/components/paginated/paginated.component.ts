import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-paginated',
  standalone: true,
  imports: [NgxPaginationModule, CommonModule],
  templateUrl: './paginated.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaginatedComponent {
  @Input() paginationId!: string
  @Output() pageEmitter = new EventEmitter<number>()


  getPage(pageNumber: number) {
    document.body.scrollTo({ top: 0, behavior: 'smooth'})
    this.pageEmitter.emit(pageNumber)
  }
}
