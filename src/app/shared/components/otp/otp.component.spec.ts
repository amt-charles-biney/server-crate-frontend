import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OTPComponent } from './otp.component';
import { provideMockStore } from '@ngrx/store/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('OTPComponent', () => {
  let component: OTPComponent;
  let fixture: ComponentFixture<OTPComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OTPComponent, HttpClientTestingModule],
      providers: [provideMockStore({})]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OTPComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
