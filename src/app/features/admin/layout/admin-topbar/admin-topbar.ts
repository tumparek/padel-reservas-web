import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-admin-topbar',
  styleUrl: './admin-topbar.scss',
  templateUrl: './admin-topbar.html',
})
export class AdminTopbar {
  readonly title = input.required<string>();
  readonly toggleSidebar = output<void>();
}
