import { TestBed } from '@angular/core/testing';
import { PistasMockService } from './pistas-mock.service';

describe('PistasMockService', () => {
  let service: PistasMockService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PistasMockService);
  });

  it('exposes a non-empty seed of public courts', () => {
    expect(service.courts().length).toBeGreaterThan(0);
  });

  it('exposes courts with the expected shape', () => {
    const [firstCourt] = service.courts();
    expect(firstCourt).toMatchObject({
      id: expect.any(String),
      name: expect.any(String),
      type: expect.stringMatching(/^(indoor|outdoor)$/),
      openingTime: expect.any(String),
      closingTime: expect.any(String),
      pricePerHour: expect.any(Number),
    });
  });
});
