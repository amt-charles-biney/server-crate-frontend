import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { allowedOptionTypes } from '../../../core/utils/constants';

@Component({
  selector: 'app-specifications',
  standalone: true,
  imports: [],
  templateUrl: './specifications.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpecificationsComponent {
  @Input() brandName!: string
  @Input() specs!: any
  allowedOptionTypes = allowedOptionTypes

}
