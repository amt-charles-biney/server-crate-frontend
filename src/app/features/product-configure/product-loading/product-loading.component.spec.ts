import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductLoadingComponent } from './product-loading.component';

describe('ProductLoadingComponent', () => {
  let component: ProductLoadingComponent;
  let fixture: ComponentFixture<ProductLoadingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductLoadingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProductLoadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
