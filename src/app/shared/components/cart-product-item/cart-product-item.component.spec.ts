import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartProductItemComponent } from './cart-product-item.component';

describe('CartProductItemComponent', () => {
  let component: CartProductItemComponent;
  let fixture: ComponentFixture<CartProductItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartProductItemComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CartProductItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
