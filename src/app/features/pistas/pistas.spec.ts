import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { PistasMockService } from './pistas-mock.service';
import { Pistas } from './pistas';

describe('Pistas', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Pistas],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(Pistas);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders a reserve link per court pointing to /reservar with the court id', () => {
    const fixture = TestBed.createComponent(Pistas);
    fixture.detectChanges();

    const pistasMock = TestBed.inject(PistasMockService);
    const compiled = fixture.nativeElement as HTMLElement;
    const links = compiled.querySelectorAll('a');

    expect(links.length).toBe(pistasMock.courts().length);
    expect(links[0].getAttribute('href')).toBe(`/reservar?courtId=${pistasMock.courts()[0].id}`);
  });
});
