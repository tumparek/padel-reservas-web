import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthMockService } from '../../../features/auth/auth-mock.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  styleUrl: './navbar.scss',
  templateUrl: './navbar.html',
})
export class Navbar {
  private readonly authMock = inject(AuthMockService);

  readonly currentUser = this.authMock.currentUser;
  readonly isAuthenticated = this.authMock.isAuthenticated;

  logout(): void {
    this.authMock.logout();
  }
}
