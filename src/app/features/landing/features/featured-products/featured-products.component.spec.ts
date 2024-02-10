import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeaturedProductsComponent } from './featured-products.component';
import { provideMockStore } from '@ngrx/store/testing';

describe('FeaturedProductsComponent', () => {
  let component: FeaturedProductsComponent;
  let fixture: ComponentFixture<FeaturedProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeaturedProductsComponent],
      providers: [provideMockStore({})]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FeaturedProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
