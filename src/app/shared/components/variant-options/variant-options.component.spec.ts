import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VariantOptionsComponent } from './variant-options.component';
import { provideMockStore } from '@ngrx/store/testing';

describe('VariantOptionsComponent', () => {
  let component: VariantOptionsComponent;
  let fixture: ComponentFixture<VariantOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VariantOptionsComponent],
      providers: [provideMockStore({})]
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
