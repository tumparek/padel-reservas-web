import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  styleUrl: './navbar.scss',
  templateUrl: './navbar.html',
})
export class Navbar {}
