import { Component } from '@angular/core';
import { HeaderComponent } from '../../core/components/header/header.component';
import { FooterComponent } from '../../core/components/footer/footer.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-configure',
  standalone: true,
  imports: [HeaderComponent, FooterComponent],
  templateUrl: './product-configure.component.html',
  styleUrl: './product-configure.component.scss'
})
export class ProductConfigureComponent {

  productId: string | null = "";

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id');
    console.log("get param id is ", this.productId)
  }

}
