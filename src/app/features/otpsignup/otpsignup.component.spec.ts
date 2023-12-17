import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OTPSignupComponent } from './otpsignup.component';

describe('OTPSignupComponent', () => {
  let component: OTPSignupComponent;
  let fixture: ComponentFixture<OTPSignupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OTPSignupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OTPSignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
