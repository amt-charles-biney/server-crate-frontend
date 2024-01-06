import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { map, takeWhile, tap, timer } from 'rxjs';
import { resetLoader, setLoadingSpinner } from '../../../store/loader/actions/loader.actions';
import { TimerService } from '../../../core/services/timer/timer.service';

@Component({
  selector: 'app-countdown',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './countdown.component.html',
  styleUrl: './countdown.component.scss',
})
export class CountdownComponent {
  @Input() timeInMinutes!: number;

  constructor(private store: Store, private timerService: TimerService) {}
  secondsRemaining$ = timer(0, 1000).pipe(
    map((n) => {
      const time = (this.timeInMinutes * 60 - n) * 1000;
      sessionStorage.setItem(
        'server-crate-otp-expiration',
        JSON.stringify(time / 60000)
      );
      return time;
    }),
    takeWhile((time) => time >= 0),
    tap((time) => {
      if (time === 0) {
        this.timerService.setTimer(0)
        console.log('time', time);
        this.store.dispatch(
          setLoadingSpinner({
            status: false,
            message: 'OTP is expired. Please click Resend',
            isError: true,
          })
        );
      }
    })
  );
}
