import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttributeModalComponent } from './attribute-modal.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { provideMockStore } from '@ngrx/store/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AttributeModalComponent', () => {
  let component: AttributeModalComponent;
  let fixture: ComponentFixture<AttributeModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttributeModalComponent, HttpClientTestingModule],
      providers: [
        {provide: MatDialogRef, useValue: {}},
        {provide: MAT_DIALOG_DATA, useValue: []},
        provideMockStore({})

      ]
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
