import { toSignal } from '@angular/core/rxjs-interop';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { AuthMockService } from '../auth/auth-mock.service';
import { PistasMockService } from '../pistas/pistas-mock.service';

@Component({
  selector: 'app-reservar',
  imports: [ReactiveFormsModule, RouterLink],
  styleUrl: './reservar.scss',
  templateUrl: './reservar.html',
})
export class Reservar {
  private readonly authMock = inject(AuthMockService);
  private readonly pistasMock = inject(PistasMockService);
  private readonly route = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);

  readonly isAuthenticated = this.authMock.isAuthenticated;
  readonly courts = this.pistasMock.courts;

  private readonly courtIdFromQuery = toSignal(
    this.route.queryParamMap.pipe(map((params) => params.get('courtId') ?? '')),
    { initialValue: this.route.snapshot.queryParamMap.get('courtId') ?? '' },
  );

  readonly submitted = signal(false);

  readonly form = this.fb.nonNullable.group({
    court: [this.courtIdFromQuery(), Validators.required],
    date: ['', Validators.required],
    time: ['', Validators.required],
    durationMinutes: this.fb.nonNullable.control<60 | 90 | 120>(60, Validators.required),
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitted.set(true);
  }
}
