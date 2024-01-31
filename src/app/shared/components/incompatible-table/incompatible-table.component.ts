import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AttributeOption } from '../../../types';

@Component({
  selector: 'app-incompatible-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './incompatible-table.component.html',
  styleUrl: './incompatible-table.component.scss'
})
export class IncompatibleTableComponent {
  @Input() incompatibleSet!: Record<string, AttributeOption[]>
  @Output() removeAttributeEmitter = new EventEmitter<AttributeOption>()

  removeAttributeOption(attributeOption: AttributeOption) {
      this.removeAttributeEmitter.emit(attributeOption)
    
  }
  
}
