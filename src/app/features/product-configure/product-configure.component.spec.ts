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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
