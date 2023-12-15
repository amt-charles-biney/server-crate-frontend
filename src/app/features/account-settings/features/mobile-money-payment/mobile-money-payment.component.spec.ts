import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileMoneyPaymentComponent } from './mobile-money-payment.component';

describe('MobileMoneyPaymentComponent', () => {
  let component: MobileMoneyPaymentComponent;
  let fixture: ComponentFixture<MobileMoneyPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileMoneyPaymentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MobileMoneyPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
