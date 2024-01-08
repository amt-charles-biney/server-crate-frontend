import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreferenceSelectionComponent } from './preference-selection.component';

describe('PreferenceSelectionComponent', () => {
  let component: PreferenceSelectionComponent;
  let fixture: ComponentFixture<PreferenceSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreferenceSelectionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PreferenceSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
