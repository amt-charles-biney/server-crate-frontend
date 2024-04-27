import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Select } from '../../../types';
import { Router, RouterLink } from '@angular/router';
import { refineActiveMenuFilter } from '../../../core/utils/helpers';

@Component({
  selector: 'app-menu-item',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './menu-item.component.html',
  styleUrl: './menu-item.component.scss',
})
export class MenuItemComponent implements OnInit {
  @Input() nameOfMenuItem: string = '';
  @Input() children: Select[] = [];
  @Input() openMenuItem: boolean = false;
  @Output() hideOtherMenuItems = new EventEmitter<string>();
  @Output() closeMenuEmitter = new EventEmitter()
  constructor(private router: Router) {}
  menuItemIsOpen = false;
  ngOnInit(): void {
    this.menuItemIsOpen = this.openMenuItem;
  }

  selectMenuItem() {
    this.menuItemIsOpen = !this.menuItemIsOpen;
    if (this.menuItemIsOpen) {
      this.hideOtherMenuItems.emit(this.nameOfMenuItem);
    } else {
      this.hideOtherMenuItems.emit('');
    }
  }

  filterByChild(nameOfMenuItem: string, childName: string) {
    this.router.navigate(['/servers'], {
      replaceUrl: true,
      queryParams: {
        page: 0,
        size: 9,
        [refineActiveMenuFilter(nameOfMenuItem)]: `${childName}`,
      },
      queryParamsHandling: 'merge',
    });
    this.closeMenu()
  }

  closeMenu() {
    this.hideOtherMenuItems.emit('');
    this.closeMenuEmitter.emit()
  }
}
