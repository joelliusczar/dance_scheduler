import { Component, OnInit, HostListener, Input } from '@angular/core';
import { DanceSchedulerRoute } from '../routeDefintions';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.sass']
})
export class MenuComponent implements OnInit {

	@Input() routeDescriptions: Array<DanceSchedulerRoute>;
	currentStyles: {};

  constructor() { }

  ngOnInit(): void {
		this.setClassesForScreenSize();
	}
	
	setClassesForScreenSize() {
		const isSmallScreen = window.innerWidth <= 640;
		this.currentStyles = {
			'width': isSmallScreen ? '50%' : '200px',
		};
	}

	@HostListener('window:resize', ['$event'])
	getScreenSize() : void {
		this.setClassesForScreenSize();
	}

}
