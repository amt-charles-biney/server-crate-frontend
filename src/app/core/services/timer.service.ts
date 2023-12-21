import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TimerService {
  private time$ = new BehaviorSubject<number>(Number(sessionStorage.getItem('server-crate-otp-expiration')) || 5)
  

  constructor() { }

  setTimer(time: number) {
    this.time$.next(time)
  }

  getTimer() {
    return this.time$.asObservable()
  }
}
