import { Component, OnInit, Input } from '@angular/core';
import { DanceSchedulerRoute } from '../routeDefintions';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.sass']
})
export class MenuComponent implements OnInit {

	@Input() routeDescriptions: DanceSchedulerRoute[];
	@Input('styleOverrides') currentStyles: {};

  constructor() { }

  ngOnInit(): void {
	}

}
