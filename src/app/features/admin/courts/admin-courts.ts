import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminMockService } from '../admin-mock.service';
import { Court, CourtStatus, CourtType } from '../models/court.model';

@Component({
  selector: 'app-admin-courts',
  imports: [ReactiveFormsModule],
  styleUrl: './admin-courts.scss',
  templateUrl: './admin-courts.html',
})
export class AdminCourts {
  private readonly adminMock = inject(AdminMockService);
  private readonly fb = inject(FormBuilder);

  readonly courts = this.adminMock.courts;

  readonly isModalOpen = signal(false);
  readonly editingCourtId = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    type: this.fb.nonNullable.control<CourtType>('indoor', Validators.required),
    openingTime: ['08:00', Validators.required],
    closingTime: ['22:00', Validators.required],
    pricePerHour: [15, [Validators.required, Validators.min(0)]],
    status: this.fb.nonNullable.control<CourtStatus>('activa', Validators.required),
  });

  openCreateModal(): void {
    this.editingCourtId.set(null);
    this.form.reset({
      name: '',
      type: 'indoor',
      openingTime: '08:00',
      closingTime: '22:00',
      pricePerHour: 15,
      status: 'activa',
    });
    this.isModalOpen.set(true);
  }

  openEditModal(court: Court): void {
    this.editingCourtId.set(court.id);
    this.form.reset({
      name: court.name,
      type: court.type,
      openingTime: court.openingTime,
      closingTime: court.closingTime,
      pricePerHour: court.pricePerHour,
      status: court.status,
    });
    this.isModalOpen.set(true);
  }

  closeModal(): void {
    this.isModalOpen.set(false);
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    const editingId = this.editingCourtId();

    if (editingId) {
      this.adminMock.updateCourt(editingId, value);
    } else {
      this.adminMock.addCourt(value);
    }

    this.closeModal();
  }

  remove(court: Court): void {
    if (confirm(`¿Eliminar la pista "${court.name}"?`)) {
      this.adminMock.deleteCourt(court.id);
    }
  }
}
