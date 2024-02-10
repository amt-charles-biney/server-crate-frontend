import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { OTP_EXPIRATION } from '../../utils/constants';

@Injectable({
  providedIn: 'root'
})
export class TimerService {
  private time$ = new BehaviorSubject<number>(Number(sessionStorage.getItem(OTP_EXPIRATION)) || 5)
  

  constructor() { }

  setTimer(time: number) {
    this.time$.next(time)
  }

  getTimer() {
    return this.time$.asObservable()
  }
}
