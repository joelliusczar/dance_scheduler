import { Component, OnInit, HostListener } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.sass']
})
export class MenuComponent implements OnInit {

	currentClasses: {};

  constructor() { }

  ngOnInit(): void {
		this.setClassesForScreenSize();
	}
	
	setClassesForScreenSize() {
		const isSmallScreen = window.innerWidth <= 640;
		this.currentClasses = {
			'width-half': isSmallScreen,
			'width-fs-menu': !isSmallScreen,
			'menu-base': true,
		};
	}

	@HostListener('window:resize', ['$event'])
	getScreenSize() : void {
		this.setClassesForScreenSize();
	}

}
