import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomepageProductItemComponent } from './homepage-product-item.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('HomepageProductItemComponent', () => {
  let component: HomepageProductItemComponent;
  let fixture: ComponentFixture<HomepageProductItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomepageProductItemComponent, RouterTestingModule]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HomepageProductItemComponent);
    component = fixture.componentInstance;
    component.product = {
      category: { id: '', name: ''},
      coverImage: 'ss',
      id: '',
      imageUrl: '',
      inStock: 0,
      isFeatured: false,
      productBrand: '',
      productDescription: '',
      productId: '',
      productName: '',
      productPrice: '',
      sales: 20,
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
