import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttributeModalComponent } from './attribute-modal.component';

describe('AttributeModalComponent', () => {
  let component: AttributeModalComponent;
  let fixture: ComponentFixture<AttributeModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttributeModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AttributeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
