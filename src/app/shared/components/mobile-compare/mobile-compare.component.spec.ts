import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileCompareComponent } from './mobile-compare.component';

describe('MobileCompareComponent', () => {
  let component: MobileCompareComponent;
  let fixture: ComponentFixture<MobileCompareComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileCompareComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MobileCompareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
