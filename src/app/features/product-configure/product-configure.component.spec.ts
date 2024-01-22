import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductConfigureComponent } from './product-configure.component';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { provideAnimations } from '@angular/platform-browser/animations';

describe('ProductConfigureComponent', () => {
  let component: ProductConfigureComponent;
  let fixture: ComponentFixture<ProductConfigureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductConfigureComponent, RouterTestingModule, HttpClientTestingModule],
      providers: [provideMockStore({}), provideAnimations()]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProductConfigureComponent);
    component = fixture.componentInstance;
    component.product = {
      category: { id: '', name: ''},
      coverImage: '',
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
    component.productConfigItem = {
      configurationPrice: 0,
      configurations: [],
      productPrice: 0,
      productId: '',
      totalPrice: 0,
      vatIncluded: 0,
      warrantyType: false
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
