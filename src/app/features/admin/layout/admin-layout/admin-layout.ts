import { toSignal } from '@angular/core/rxjs-interop';
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, map, startWith } from 'rxjs';
import { AdminSidebar } from '../admin-sidebar/admin-sidebar';
import { AdminTopbar } from '../admin-topbar/admin-topbar';

@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet, AdminSidebar, AdminTopbar],
  styleUrl: './admin-layout.scss',
  templateUrl: './admin-layout.html',
})
export class AdminLayout {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly sidebarOpen = signal(false);

  readonly sectionTitle = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map(() => this.currentRouteTitle()),
      startWith(this.currentRouteTitle()),
    ),
    { initialValue: '' },
  );

  toggleSidebar(): void {
    this.sidebarOpen.update((open) => !open);
  }

  private currentRouteTitle(): string {
    let snapshot = this.route.snapshot;
    while (snapshot.firstChild) {
      snapshot = snapshot.firstChild;
    }
    return snapshot.data['title'] ?? '';
  }
}
