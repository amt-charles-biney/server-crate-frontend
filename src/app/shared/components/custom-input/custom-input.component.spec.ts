import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomInputComponent } from './custom-input.component';
import { provideMockStore } from '@ngrx/store/testing';

describe('CustomInputComponent', () => {
  let component: CustomInputComponent;
  let fixture: ComponentFixture<CustomInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomInputComponent],
      providers: [provideMockStore({})]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CustomInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
