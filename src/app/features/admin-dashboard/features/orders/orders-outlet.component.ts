import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-orders-outlet',
  standalone: true,
  imports: [RouterOutlet],
  template: '<router-outlet />'
})
export class OrdersOutletComponent {

}
