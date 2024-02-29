import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ProductItem } from '../../../types';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AttributeModalComponent } from '../../../features/admin-dashboard/features/attributes/features/attribute-modal/attribute-modal.component';

@Component({
  selector: 'app-indicators',
  standalone: true,
  imports: [],
  templateUrl: './indicators.component.html',
  styleUrl: './indicators.component.scss',
})
export class IndicatorsComponent implements OnInit {
  @Input() product!: ProductItem;
  @Output() closeNotification = new EventEmitter();
  constructor(private router: Router, private dialog: MatDialog) {}
  categoryIssue: boolean = false;
  stockIssue: boolean = false;

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
  close() {
    this.closeNotification.emit();
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
          data: { }
        })
      }, 0);
    }
  }
}
