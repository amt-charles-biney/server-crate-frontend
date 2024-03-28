import { CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import {
  MatDatepickerInputEvent,
  MatDatepickerModule,
} from '@angular/material/datepicker';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-date-picker',
  standalone: true,
  imports: [MatDatepickerModule, ReactiveFormsModule, DatePipe, MatIconModule, CommonModule],
  templateUrl: './date-picker.component.html',
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DatePickerComponent implements OnInit {
  @Input() textClass = 'text-base'
  @Input() iconScale = 'scale-100'
  @Input() containerClass = 'h-[42px]'
  @Output() toDateEmitter = new EventEmitter<Date>();
  @Output() fromDateEmitter = new EventEmitter<Date>();
  rangeDate!: FormGroup;

  constructor(
    private domSanitizer: DomSanitizer,
    private matIconRegistry: MatIconRegistry,
    private activatedRoute: ActivatedRoute
  ) {
    this.matIconRegistry.addSvgIcon(
      'myDatePicker',
      this.domSanitizer.bypassSecurityTrustResourceUrl('/assets/datepicker.svg')
    );
  }

  ngOnInit(): void {
    this.rangeDate = new FormGroup({
      toDate: new FormControl(null),
      fromDate: new FormControl(null),
    });

    this.activatedRoute.queryParams.subscribe((params) => {
      if (params['startDate']) {
        this.rangeDate.patchValue({ fromDate: params['startDate']})
      }
      if (params['endDate']) {
        this.rangeDate.patchValue({ toDate: params['endDate']})
      }
    });
  }

  /**
   * This function sets the "to" date
   * @param date - Date selected from date picker
   * @returns {void}
   */
  onToDateChange(date: MatDatepickerInputEvent<Date>): void {
    this.rangeDate.patchValue({ toDate: date.value });
    if (date.value) {
      this.toDateEmitter.emit(date.value);
    }
  }

  /**
   * This function sets the "from" date
   * @param date - Date selected from date picker
   * @returns {void}
   */
  onFromDateChange(date: MatDatepickerInputEvent<Date>): void {
    this.rangeDate.patchValue({ fromDate: date.value });
    if (date.value) {
      this.fromDateEmitter.emit(date.value);
    }
  }
}
