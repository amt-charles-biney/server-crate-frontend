import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ProductItem } from '../../../types';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AttributeModalComponent } from '../../../features/admin-dashboard/features/attributes/features/attribute-modal/attribute-modal.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-indicators',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './indicators.component.html',
  styleUrl: './indicators.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IndicatorsComponent implements OnInit, AfterViewInit {
  @Input() product!: ProductItem;
  @Output() closeNotification = new EventEmitter();
  @ViewChild('element') element!: ElementRef
  constructor(private router: Router, private dialog: MatDialog, private cdr: ChangeDetectorRef) {}
  categoryIssue: boolean = false;
  stockIssue: boolean = false;
  inViewport!: boolean
  title: string = '';
  color: string = 'text-red-color';
  description: string = '';
  ngOnInit(): void {    
    if (this.product.inStock === 0) {
      this.title = 'Finished Variant';
      this.color = 'text-red-color';
      this.description = '';
      this.stockIssue = true;
    } else {
      this.stockIssue = true;
      this.title = this.product.stockStatus;
      this.color = 'text-amber-400';
      this.description =
        'This product is currently low on stock. Click on the fix button below to get it resolved.';
    }

    if (this.product.category.name === 'unassigned') {
      this.categoryIssue = true;
      this.title = 'Unassigned Category';
      this.color = 'text-red-color';
      this.description =
        'This product has an unassigned category. Click on the fix button below to get it resolved.';
    }
  }
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.inViewport = this.isInViewport(this.element.nativeElement)
      this.cdr.markForCheck()
      console.log('is in viewport', this.inViewport);
    }, 0);
  }
  
  close() {
    this.closeNotification.emit();
  }

  isInViewport(el: HTMLElement) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)

    );
}

  fix() {
    if (this.categoryIssue) {
      console.log('Category issue');
      this.router.navigate(['/admin/add-product', this.product.id])
    } else {
      console.log('Stock issue');
      this.router.navigate(['/admin/attributes'])
      setTimeout(() => {
        this.dialog.open(AttributeModalComponent, {
          data: { },
          height: '80%',
          width: '70%'
        })
      }, 0);
    }
  }
}
