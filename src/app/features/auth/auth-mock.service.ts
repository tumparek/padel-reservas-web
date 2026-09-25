import { Injectable, Signal, computed, signal } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay, map, switchMap, tap } from 'rxjs/operators';
import { User } from './models/user.model';

interface MockUserRecord extends User {
  password: string;
}

const SEED_USERS: MockUserRecord[] = [
  { id: 'user-1', name: 'Ana García', email: 'ana@example.com', password: 'padel123' },
  { id: 'user-2', name: 'Carlos Pérez', email: 'carlos@example.com', password: 'padel123' },
];

@Injectable({ providedIn: 'root' })
export class AuthMockService {
  private readonly usersSignal = signal<MockUserRecord[]>(SEED_USERS);
  private readonly currentUserSignal = signal<User | null>(null);

  readonly currentUser: Signal<User | null> = this.currentUserSignal.asReadonly();
  readonly isAuthenticated = computed(() => this.currentUserSignal() !== null);

  login(email: string, password: string): Observable<User> {
    const record = this.usersSignal().find(
      (user) => user.email.toLowerCase() === email.toLowerCase() && user.password === password,
    );

    if (!record) {
      return of(null).pipe(
        delay(400),
        switchMap(() => throwError(() => new Error('Email o contraseña incorrectos'))),
      );
    }

    return of(record).pipe(
      delay(400),
      map((user) => this.toPublicUser(user)),
      tap((user) => this.currentUserSignal.set(user)),
    );
  }

  register(data: { name: string; email: string; password: string }): Observable<User> {
    const alreadyExists = this.usersSignal().some(
      (user) => user.email.toLowerCase() === data.email.toLowerCase(),
    );

    if (alreadyExists) {
      return of(null).pipe(
        delay(400),
        switchMap(() => throwError(() => new Error('Ya existe una cuenta con ese email'))),
      );
    }

    const newUser: MockUserRecord = { id: crypto.randomUUID(), ...data };

    return of(newUser).pipe(
      delay(400),
      tap((user) => this.usersSignal.update((users) => [...users, user])),
      map((user) => this.toPublicUser(user)),
      tap((user) => this.currentUserSignal.set(user)),
    );
  }

  logout(): void {
    this.currentUserSignal.set(null);
  }

  private toPublicUser(user: MockUserRecord): User {
    return { id: user.id, name: user.name, email: user.email };
  }
}
