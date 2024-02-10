import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditCardPaymentComponent } from './credit-card-payment.component';
import { provideMockStore } from '@ngrx/store/testing';

describe('CreditCardPaymentComponent', () => {
  let component: CreditCardPaymentComponent;
  let fixture: ComponentFixture<CreditCardPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreditCardPaymentComponent],
      providers: [provideMockStore({})]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreditCardPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
