import { AllProducts } from './../../../../types';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ProductsPageComponent } from './products-page.component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { PRODUCTS } from '../../../../core/services/admin/admin.service.test';
import { DebugElement, DestroyRef } from '@angular/core';
import { ProductItemComponent } from '../../../../shared/components/product-item/product-item.component';
import { Store } from '@ngrx/store';
import { By } from '@angular/platform-browser';


fdescribe('ProductsPageComponent', () => {
  let component: ProductsPageComponent;
  let fixture: ComponentFixture<ProductsPageComponent>;
  let el: DebugElement;
  let store: MockStore<{ products: AllProducts }>;
  const initState: { products: AllProducts } = {
    products: { 
      products: [], 
      total: 0 
    }
  }
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ProductsPageComponent,
        RouterTestingModule,
        ProductItemComponent,
      ],
      providers: [provideMockStore({ initialState: initState })],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductsPageComponent);
    component = fixture.componentInstance;
    el = fixture.debugElement;
    store = TestBed.inject(Store) as MockStore<{products: AllProducts}>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should list all products', () => {
    store.setState({products: PRODUCTS});
    component.products.subscribe((products) => {  
      expect(products.length).toBe(PRODUCTS.products.length)    
    });
  });
});
