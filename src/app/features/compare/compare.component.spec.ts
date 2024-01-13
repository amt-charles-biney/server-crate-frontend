import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompareComponent } from './compare.component';
import { provideMockStore } from '@ngrx/store/testing';

describe('CompareComponent', () => {
  let component: CompareComponent;
  let fixture: ComponentFixture<CompareComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompareComponent],
      providers: [provideMockStore({})]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CompareComponent);
    component = fixture.componentInstance;
    component.firstProduct = {
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
    component.secondProduct = {
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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
