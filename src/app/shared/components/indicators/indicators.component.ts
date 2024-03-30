import { Attribute, ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
export class IndicatorsComponent implements OnInit {
  @Input() product!: ProductItem;
  @Output() closeNotification = new EventEmitter();
  constructor(private router: Router, private dialog: MatDialog) {}
  categoryIssue: boolean = false;
  stockIssue: boolean = false;
  inViewport!: boolean
  title: string = '';
  color: string = 'text-red-color';
  description: string = '';
  ngOnInit(): void {    
    if (this.product.inStock === 0) {
      let setOfNoStockAttributes: Set<string> = new Set()
      this.product.totalLeastStock.forEach((attribute) =>{ 
        for (let option of attribute.attributeOptions) {
          if (option.inStock === 0) {
            setOfNoStockAttributes.add(option.optionName)
          }
        }
      })
      const listOfNoStockAttributes = Array.from(setOfNoStockAttributes)
      const isOrAre = this.isOrAre(listOfNoStockAttributes)
      
      this.title = 'Finished Variant';
      this.color = 'text-red-color';
      
      this.description = `${listOfNoStockAttributes.join(', ')} ${isOrAre} finished`;
      this.stockIssue = true;
    } else {
      let setOfLowStockAttributes: Set<string> = new Set()
      this.product.totalLeastStock.forEach((attribute) =>{ 
        for (let option of attribute.attributeOptions) {
          if (option.inStock <= 5) {
            setOfLowStockAttributes.add(option.optionName)
          }
        }
      })
      const listOfLowStockAttributes = Array.from(setOfLowStockAttributes)
      const isOrAre = this.isOrAre(listOfLowStockAttributes)
      this.stockIssue = true;
      this.title = this.product.stockStatus;
      this.color = 'text-amber-400';
      this.description =
      `${listOfLowStockAttributes.join(', ')} ${isOrAre} low in stock`
    }

    if (this.product.category.name === 'unassigned') {
      this.categoryIssue = true;
      this.stockIssue = false
      this.title = 'Unassigned Category';
      this.color = 'text-red-color';
      this.description =
        'This product has an unassigned category. Click on the fix button below to get it resolved.';
    }
  }
  
  close() {
    this.closeNotification.emit();
  }

  isOrAre(arr: Array<any>) {
    if (arr.length === 1) {
      return 'is'
    }
    return 'are'
  }

  fix() {
    if (this.categoryIssue) {
      this.router.navigate(['/admin/add-product', this.product.id])
    } else {
      // this.router.navigate(['/admin/attributes'])
      let attributeToCheck: Attribute
      if (this.product.inStock === 0) {
        const noStockAttribute: Attribute = this.product.totalLeastStock.find((option) => option.attributeOptions.find(opt => opt.inStock === 0))!
        attributeToCheck = noStockAttribute
      } else if (this.product.inStock <= 5) {
        const lowStockAttribute: Attribute = this.product.totalLeastStock.find((option) => option.attributeOptions.find(opt => opt.inStock <= 5))!
        attributeToCheck = lowStockAttribute
        console.log('Attribute To Check', attributeToCheck);
        
      }
      setTimeout(() => {
        this.dialog.open(AttributeModalComponent, {
          data: { attribute: attributeToCheck},
          height: '80%',
          width: '70%'
        })
        
      }, 0);
    }
  }
}