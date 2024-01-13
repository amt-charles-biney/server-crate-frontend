import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordInformationComponent } from './password-information.component';
import { provideMockStore } from '@ngrx/store/testing';

describe('PasswordInformationComponent', () => {
  let component: PasswordInformationComponent;
  let fixture: ComponentFixture<PasswordInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PasswordInformationComponent],
      providers: [provideMockStore({})]
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
