import { Component } from '@angular/core';
import { ProductItemComponent } from '../../../../shared/components/product-item/product-item.component';
import { ProductItem } from '../../../../types';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-products-page',
  standalone: true,
  imports: [ProductItemComponent, RouterModule],
  templateUrl: './products-page.component.html',
  styleUrl: './products-page.component.scss'
})
export class ProductsPageComponent {
  product: ProductItem = {
    brand: 'Proliant DL385 G10 Plus',
     image: '/assets/server.svg',
     inStock: 200,
     name: 'HPE P39123-Server',
     price: '2000',
     sales: 11.01,
  }
}
