import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomSizeSelectionComponent } from './custom-size-selection.component';

describe('CustomSizeSelectionComponent', () => {
  let component: CustomSizeSelectionComponent;
  let fixture: ComponentFixture<CustomSizeSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomSizeSelectionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CustomSizeSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
