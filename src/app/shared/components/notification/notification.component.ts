import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [],
  templateUrl: './notification.component.html',
})
export class NotificationComponent {
  @Input() message!: string 
  @Output() action = new EventEmitter<void>()


  fix() {
    this.action.emit()
  }
}
