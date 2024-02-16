import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncompatiblesComponent } from './incompatibles.component';

describe('IncompatiblesComponent', () => {
  let component: IncompatiblesComponent;
  let fixture: ComponentFixture<IncompatiblesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncompatiblesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IncompatiblesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
