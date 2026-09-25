import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PistasMockService } from './pistas-mock.service';

@Component({
  selector: 'app-pistas',
  imports: [RouterLink],
  styleUrl: './pistas.scss',
  templateUrl: './pistas.html',
})
export class Pistas {
  private readonly pistasMock = inject(PistasMockService);

  readonly courts = this.pistasMock.courts;
}
