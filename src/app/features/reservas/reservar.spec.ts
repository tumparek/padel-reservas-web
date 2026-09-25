import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AuthMockService } from '../auth/auth-mock.service';
import { Reservar } from './reservar';

describe('Reservar', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Reservar],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(Reservar);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('shows a login prompt when there is no authenticated user', () => {
    const fixture = TestBed.createComponent(Reservar);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.reservar__login-required')).toBeTruthy();
    expect(compiled.querySelector('form')).toBeNull();
  });

  it('shows the reservation form when the user is authenticated', async () => {
    vi.useFakeTimers();
    const authMock = TestBed.inject(AuthMockService);
    authMock.register({ name: 'Ana', email: 'ana2@example.com', password: 'secreto1' }).subscribe();
    await vi.advanceTimersByTimeAsync(400);
    vi.useRealTimers();

    const fixture = TestBed.createComponent(Reservar);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.reservar__login-required')).toBeNull();
    expect(compiled.querySelector('form')).toBeTruthy();
  });
});
