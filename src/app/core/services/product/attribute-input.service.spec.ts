import { TestBed } from '@angular/core/testing';

import { AttributeInputService } from './attribute-input.service';

describe('AttributeInputService', () => {
  let service: AttributeInputService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AttributeInputService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
