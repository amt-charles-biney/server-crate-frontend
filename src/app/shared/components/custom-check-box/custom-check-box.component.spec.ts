import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomCheckBoxComponent } from './custom-check-box.component';

describe('CustomCheckBoxComponent', () => {
  let component: CustomCheckBoxComponent;
  let fixture: ComponentFixture<CustomCheckBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomCheckBoxComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CustomCheckBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
