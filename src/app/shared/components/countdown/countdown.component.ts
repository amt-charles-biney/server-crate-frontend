import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy } from '@angular/core';
import { map, takeWhile, tap, timer } from 'rxjs';

@Component({
  selector: 'app-countdown',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './countdown.component.html',
  styleUrl: './countdown.component.scss'
})
export class CountdownComponent  {
  @Input() timeInMinutes!: number;

  secondsRemaining$ = timer(0, 1000).pipe(
    map(n => {
      const time = ((this.timeInMinutes * 60) - n) * 1000
      sessionStorage.setItem('server-crate-otp-expiration', JSON.stringify(time / 60000))
      return time
    }),
    takeWhile(n => n >= 0),
  );
}
