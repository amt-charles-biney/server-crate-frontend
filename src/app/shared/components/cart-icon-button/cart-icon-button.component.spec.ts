import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartIconButtonComponent } from './cart-icon-button.component';

describe('CartIconButtonComponent', () => {
  let component: CartIconButtonComponent;
  let fixture: ComponentFixture<CartIconButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartIconButtonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CartIconButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
