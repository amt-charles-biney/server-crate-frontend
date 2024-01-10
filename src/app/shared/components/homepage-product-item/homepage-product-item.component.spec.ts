import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomepageProductItemComponent } from './homepage-product-item.component';

describe('HomepageProductItemComponent', () => {
  let component: HomepageProductItemComponent;
  let fixture: ComponentFixture<HomepageProductItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomepageProductItemComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HomepageProductItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
