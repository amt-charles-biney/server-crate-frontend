import { provideAnimations } from '@angular/platform-browser/animations';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreferenceSelectionComponent } from './preference-selection.component';
import { provideMockStore } from '@ngrx/store/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('PreferenceSelectionComponent', () => {
  let component: PreferenceSelectionComponent;
  let fixture: ComponentFixture<PreferenceSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreferenceSelectionComponent, RouterTestingModule],
      providers: [provideMockStore({}), provideAnimations()]
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
