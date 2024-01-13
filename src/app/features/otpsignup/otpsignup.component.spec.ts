import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OTPSignupComponent } from './otpsignup.component';
import { provideMockStore } from '@ngrx/store/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('OTPSignupComponent', () => {
  let component: OTPSignupComponent;
  let fixture: ComponentFixture<OTPSignupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OTPSignupComponent, HttpClientTestingModule],
      providers: [provideMockStore({})]
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
