import { Directive, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[appHover]',
  standalone: true
})
export class HoverDirective {
  @Output() hoverEmitter = new EventEmitter<boolean>()
  constructor() { }

  @HostListener('mouseenter') onMouseEnter() {    
    this.hoverEmitter.emit(true)
  }
  @HostListener('mouseleave') onMouseLeave() {
    this.hoverEmitter.emit(false)
  }
}
