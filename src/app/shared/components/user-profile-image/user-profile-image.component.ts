import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-user-profile-image',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './user-profile-image.component.html',
  styleUrl: './user-profile-image.component.scss'
})
export class UserProfileImageComponent implements OnInit {
  @Input() smaller!: boolean
  initials!: string
  ngOnInit(): void {
    const { firstName, lastName } = JSON.parse(localStorage.getItem('server-crate-user') ?? '')
    this.initials = `${firstName[0]}${lastName[0]}`
  }
}
