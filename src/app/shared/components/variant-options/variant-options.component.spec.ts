import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VariantOptionsComponent } from './variant-options.component';

describe('VariantOptionsComponent', () => {
  let component: VariantOptionsComponent;
  let fixture: ComponentFixture<VariantOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VariantOptionsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VariantOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
