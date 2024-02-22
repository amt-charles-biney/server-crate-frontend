import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-error',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './error.component.html',
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({transform: 'translateX(100%)'}),
        animate('500ms ease-in', style({transform: 'translateX(0)'}))
      ]),
      transition(':leave', [
        animate('500ms ease-in', style({transform: 'translateX(100%)'}))
      ])
    ])
  ]
})
export class ErrorComponent implements OnInit {
  @Input() message!: string
  @Input() visible!: boolean
  private localVisible$ = new BehaviorSubject<boolean>(false)
  localVisible = this.localVisible$.asObservable()
  ngOnInit(): void {
    this.localVisible$.next(this.visible)
    setTimeout(() => {
      this.localVisible$.next(false)
    }, 2000);
  }
}
