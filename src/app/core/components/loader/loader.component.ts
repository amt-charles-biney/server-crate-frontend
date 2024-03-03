import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NgxUiLoaderModule } from 'ngx-ui-loader';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [NgxUiLoaderModule, CommonModule],
  templateUrl: './loader.component.html',
})
export class LoaderComponent {
  @Input() loaderId!: string
  @Input() text!: string
  @Input() useDefaultOverlay!: boolean
  @Input() size: 'small' | 'big' | 'none' = 'small'
}
