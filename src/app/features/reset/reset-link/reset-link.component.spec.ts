import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetLinkComponent } from './reset-link.component';
import { provideMockStore } from '@ngrx/store/testing';

describe('ResetLinkComponent', () => {
  let component: ResetLinkComponent;
  let fixture: ComponentFixture<ResetLinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResetLinkComponent],
      providers: [provideMockStore({})]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ResetLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
