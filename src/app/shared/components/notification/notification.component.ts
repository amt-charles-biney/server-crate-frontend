import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CacheService } from '../../../core/services/cache/cache.service';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [],
  templateUrl: './notification.component.html',
})
export class NotificationComponent {
  @Input() message!: string 
  @Output() action = new EventEmitter<void>()

  constructor(private cacheService: CacheService) {}

  fix() {
    this.action.emit()
    this.cacheService.removeKeyFromCache(['/admin/product', '/admin/attributes'])
  }
}
