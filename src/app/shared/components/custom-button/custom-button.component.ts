import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-custom-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './custom-button.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomButtonComponent implements OnInit {
  @Input() buttonText!: string
  @Input() disableButton = false
  @Input() isPrimaryButton = false
  currentStyles: Record<string, string> = {}
  ngOnInit(): void {
    this.currentStyles = {
      'width': this.isPrimaryButton ? 'fit-content' : '100%',
      'padding-block': this.isPrimaryButton ? '2px' : '10px',
      'padding-inline': this.isPrimaryButton ? '8px' : ''
    }
  }
}
