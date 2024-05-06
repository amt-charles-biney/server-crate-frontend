import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output} from '@angular/core';
import { Subject } from 'rxjs';
import { Attribute, NotificationData } from '../../../types';
import { Store } from '@ngrx/store';
import { selectNotificationsState } from '../../../store/admin/products/notifications/notifications.reducers';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AttributeModalComponent } from '../../../features/admin-dashboard/features/attributes/features/attribute-modal/attribute-modal.component';
import { MatTabsModule } from '@angular/material/tabs';
import { NotificationComponent } from '../notification/notification.component';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, MatTabsModule, NotificationComponent],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotificationsComponent implements OnInit {

  @Output() closeEmitter = new EventEmitter<void>()
  private notification$ = new Subject<NotificationData>(); 
  notifications = this.notification$.asObservable();



  constructor(private store: Store, private router: Router, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.notifications = this.store.select(selectNotificationsState)
  }


  fixCategoryIssue(id: string) {
    this.router.navigate([`/admin/categories/add-category/${id}`])
    this.closeEmitter.emit()
  }

  fixUnassignedProducts(id: string) {
    this.router.navigate([`/admin/products/add-product/${id}`])
    this.closeEmitter.emit()
  }

  fixStockIssues(attribute: Attribute) {
    this.router.navigate(['/admin/attributes'])
    setTimeout(() => {
      this.dialog.open(AttributeModalComponent, {
        data: { attribute },
        height: "80%",
        width: "70%"
      })
    }, 0);
    this.closeEmitter.emit()
  }
}
