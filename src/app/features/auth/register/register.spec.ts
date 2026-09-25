import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { AuthMockService } from '../auth-mock.service';
import { Register } from './register';

describe('Register', () => {
  let authMock: AuthMockService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Register],
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
    const fixture = TestBed.createComponent(Register);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('does not call the auth service when the form is invalid', () => {
    const fixture = TestBed.createComponent(Register);
    const registerSpy = vi.spyOn(authMock, 'register');

    fixture.componentInstance.submit();

    expect(registerSpy).not.toHaveBeenCalled();
  });

  it('shows a local error and does not call the service when passwords do not match', () => {
    const fixture = TestBed.createComponent(Register);
    const registerSpy = vi.spyOn(authMock, 'register');
    const component = fixture.componentInstance;

    component.form.setValue({
      name: 'Nuevo Usuario',
      email: 'nuevo@example.com',
      password: 'secreto1',
      confirmPassword: 'otraclave',
    });
    component.submit();

    expect(registerSpy).not.toHaveBeenCalled();
    expect(component.errorMessage()).toBe('Las contraseñas no coinciden');
  });

  it('registers and navigates to home on valid data', async () => {
    const fixture = TestBed.createComponent(Register);
    const navigateSpy = vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);
    const component = fixture.componentInstance;

    component.form.setValue({
      name: 'Nuevo Usuario',
      email: 'nuevo@example.com',
      password: 'secreto1',
      confirmPassword: 'secreto1',
    });
    component.submit();

    await vi.advanceTimersByTimeAsync(400);

    expect(navigateSpy).toHaveBeenCalledWith('/');
    expect(component.errorMessage()).toBeNull();
  });

  it('shows an error when the email is already registered', async () => {
    const fixture = TestBed.createComponent(Register);
    const component = fixture.componentInstance;

    component.form.setValue({
      name: 'Otra Ana',
      email: 'ana@example.com',
      password: 'secreto1',
      confirmPassword: 'secreto1',
    });
    component.submit();

    await vi.advanceTimersByTimeAsync(400);

    expect(component.errorMessage()).toBe('Ya existe una cuenta con ese email');
  });
});
