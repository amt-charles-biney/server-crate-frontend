import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { map, takeWhile, tap, timer } from 'rxjs';
import { TimerService } from '../../../core/services/timer/timer.service';
import { OTP_EXPIRATION } from '../../../core/utils/constants';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-countdown',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './countdown.component.html',
  styleUrl: './countdown.component.scss',
})
export class CountdownComponent {
  @Input() timeInMinutes!: number;

  constructor(
    private timerService: TimerService,
    private toast: ToastrService
  ) {}
  secondsRemaining$ = timer(0, 1000).pipe(
    map((n) => {
      const time = (this.timeInMinutes * 60 - n) * 1000;
      sessionStorage.setItem(OTP_EXPIRATION, JSON.stringify(time / 60000));
      return time;
    }),
    takeWhile((time) => time >= 0),
    tap((time) => {
      if (time === 0) {
        this.timerService.setTimer(0);
        this.toast.info(
          'OTP has expired. Please click Resend',
          'Time Limit Exceeded'
        );
      }
    })
  );
}
