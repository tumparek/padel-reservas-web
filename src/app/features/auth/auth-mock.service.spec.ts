import { TestBed } from '@angular/core/testing';
import { AuthMockService } from './auth-mock.service';

describe('AuthMockService', () => {
  let service: AuthMockService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthMockService);
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('logs in with correct credentials and sets currentUser', async () => {
    let result: unknown;
    service.login('ana@example.com', 'padel123').subscribe((user) => (result = user));

    await vi.advanceTimersByTimeAsync(400);

    expect(result).toEqual({ id: 'user-1', name: 'Ana García', email: 'ana@example.com' });
    expect(service.currentUser()).toEqual({ id: 'user-1', name: 'Ana García', email: 'ana@example.com' });
    expect(service.isAuthenticated()).toBe(true);
  });

  it('fails to log in with an incorrect password and leaves currentUser null', async () => {
    let error: Error | undefined;
    service.login('ana@example.com', 'wrong-password').subscribe({
      error: (err) => (error = err),
    });

    await vi.advanceTimersByTimeAsync(400);

    expect(error?.message).toBe('Email o contraseña incorrectos');
    expect(service.currentUser()).toBeNull();
    expect(service.isAuthenticated()).toBe(false);
  });

  it('registers a new user with a new email and logs in automatically', async () => {
    let result: unknown;
    service
      .register({ name: 'Nuevo Usuario', email: 'nuevo@example.com', password: 'secreto1' })
      .subscribe((user) => (result = user));

    await vi.advanceTimersByTimeAsync(400);

    expect(result).toMatchObject({ name: 'Nuevo Usuario', email: 'nuevo@example.com' });
    expect(service.currentUser()).toMatchObject({ name: 'Nuevo Usuario', email: 'nuevo@example.com' });
    expect(service.isAuthenticated()).toBe(true);
  });

  it('fails to register with a duplicate email', async () => {
    let error: Error | undefined;
    service
      .register({ name: 'Otra Ana', email: 'ANA@example.com', password: 'secreto1' })
      .subscribe({ error: (err) => (error = err) });

    await vi.advanceTimersByTimeAsync(400);

    expect(error?.message).toBe('Ya existe una cuenta con ese email');
    expect(service.currentUser()).toBeNull();
  });

  it('logs out and clears currentUser synchronously', async () => {
    service.login('carlos@example.com', 'padel123').subscribe();
    await vi.advanceTimersByTimeAsync(400);
    expect(service.isAuthenticated()).toBe(true);

    service.logout();

    expect(service.currentUser()).toBeNull();
    expect(service.isAuthenticated()).toBe(false);
  });
});
