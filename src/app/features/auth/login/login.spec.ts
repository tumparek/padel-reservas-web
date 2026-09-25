import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { AuthMockService } from '../auth-mock.service';
import { Login } from './login';

describe('Login', () => {
  let authMock: AuthMockService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [provideRouter([])],
    }).compileComponents();

    authMock = TestBed.inject(AuthMockService);
    router = TestBed.inject(Router);
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(Login);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('does not call the auth service when the form is invalid', () => {
    const fixture = TestBed.createComponent(Login);
    const loginSpy = vi.spyOn(authMock, 'login');

    fixture.componentInstance.submit();

    expect(loginSpy).not.toHaveBeenCalled();
    expect(fixture.componentInstance.form.get('email')?.touched).toBe(true);
  });

  it('logs in and navigates to home on valid credentials', async () => {
    const fixture = TestBed.createComponent(Login);
    const navigateSpy = vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);
    const component = fixture.componentInstance;

    component.form.setValue({ email: 'ana@example.com', password: 'padel123' });
    component.submit();

    await vi.advanceTimersByTimeAsync(400);

    expect(navigateSpy).toHaveBeenCalledWith('/');
    expect(component.errorMessage()).toBeNull();
  });

  it('shows an error message on incorrect credentials', async () => {
    const fixture = TestBed.createComponent(Login);
    const component = fixture.componentInstance;

    component.form.setValue({ email: 'ana@example.com', password: 'wrong-password' });
    component.submit();

    await vi.advanceTimersByTimeAsync(400);

    expect(component.errorMessage()).toBe('Email o contraseña incorrectos');
  });
});
