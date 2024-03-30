import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-cases-outlet',
  standalone: true,
  imports: [RouterOutlet],
  template: '<router-outlet />'
})
export class CasesOutletComponent {

}
