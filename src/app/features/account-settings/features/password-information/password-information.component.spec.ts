import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordInformationComponent } from './password-information.component';

describe('PasswordInformationComponent', () => {
  let component: PasswordInformationComponent;
  let fixture: ComponentFixture<PasswordInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PasswordInformationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PasswordInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
