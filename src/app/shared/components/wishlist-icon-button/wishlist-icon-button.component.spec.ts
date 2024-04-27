import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WishlistIconButtonComponent } from './wishlist-icon-button.component';

describe('WishlistIconButtonComponent', () => {
  let component: WishlistIconButtonComponent;
  let fixture: ComponentFixture<WishlistIconButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WishlistIconButtonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WishlistIconButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
