import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AuthMockService } from '../../../features/auth/auth-mock.service';
import { Navbar } from './navbar';

describe('Navbar', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Navbar],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(Navbar);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render a working link to the admin panel', () => {
    const fixture = TestBed.createComponent(Navbar);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const adminLink = compiled.querySelector('.app-navbar__admin-link');
    expect(adminLink?.getAttribute('href')).toBe('/admin');
  });

  it('should render working links for Inicio, Pistas and Reservar', () => {
    const fixture = TestBed.createComponent(Navbar);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const links = compiled.querySelectorAll('.app-navbar__link');

    expect(links.length).toBe(3);
    expect(links[0].tagName).toBe('A');
    expect(links[0].getAttribute('href')).toBe('/');
    expect(links[1].getAttribute('href')).toBe('/pistas');
    expect(links[2].getAttribute('href')).toBe('/reservar');
  });

  it('shows login/register links and no user menu when not authenticated', () => {
    const fixture = TestBed.createComponent(Navbar);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('a[href="/login"]')).toBeTruthy();
    expect(compiled.querySelector('a[href="/register"]')).toBeTruthy();
    expect(compiled.querySelector('.app-navbar__user')).toBeNull();
  });

  it('shows the user menu after logging in and reverts to the logged-out state on logout', async () => {
    vi.useFakeTimers();
    const authMock = TestBed.inject(AuthMockService);
    authMock
      .register({ name: 'Ana García', email: 'navbar-user@example.com', password: 'secreto1' })
      .subscribe();
    await vi.advanceTimersByTimeAsync(400);
    vi.useRealTimers();

    const fixture = TestBed.createComponent(Navbar);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('.app-navbar__user')?.textContent).toContain('Ana García');
    expect(compiled.querySelector('a[href="/login"]')).toBeNull();
    expect(compiled.querySelector('a[href="/register"]')).toBeNull();

    const logoutButton = compiled.querySelector('.app-navbar__user button') as HTMLButtonElement;
    logoutButton.click();
    fixture.detectChanges();

    expect(compiled.querySelector('.app-navbar__user')).toBeNull();
    expect(compiled.querySelector('a[href="/login"]')).toBeTruthy();
    expect(compiled.querySelector('a[href="/register"]')).toBeTruthy();
  });
});
