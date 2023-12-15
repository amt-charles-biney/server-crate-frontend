import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { map, takeWhile, tap, timer } from 'rxjs';

@Component({
  selector: 'app-countdown',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './countdown.component.html',
  styleUrl: './countdown.component.scss'
})
export class CountdownComponent {
  @Input() timeInMinutes!: number;

  secondsRemaining$ = timer(0, 1000).pipe(
    tap(x => console.log('n', x)),
    map(n => ((this.timeInMinutes * 60) - n) * 1000),
    tap(console.log),
    takeWhile(n => n >= 0),
  );
}
