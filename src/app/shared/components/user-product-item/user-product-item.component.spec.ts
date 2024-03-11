import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserProductItemComponent } from './user-product-item.component';

describe('UserProductItemComponent', () => {
  let component: UserProductItemComponent;
  let fixture: ComponentFixture<UserProductItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserProductItemComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserProductItemComponent);
    component = fixture.componentInstance;
    component.product = {
      category: { id: '', name: ''},
      coverImage: 'ss',
      serviceCharge: 0,
      stockStatus: 'Available',
      id: '',
      imageUrl: [],
      inStock: 0,
      isFeatured: false,
      productBrand: {
        name: '',
        price: 0
      },
      productDescription: '',
      productId: '',
      productName: '',
      productPrice: 0,
      sales: 20,
      totalLeastStock: []
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
