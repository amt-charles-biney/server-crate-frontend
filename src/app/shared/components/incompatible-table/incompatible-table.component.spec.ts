import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncompatibleTableComponent } from './incompatible-table.component';

describe('IncompatibleTableComponent', () => {
  let component: IncompatibleTableComponent;
  let fixture: ComponentFixture<IncompatibleTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncompatibleTableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IncompatibleTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
