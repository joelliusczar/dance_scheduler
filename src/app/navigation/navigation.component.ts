import { Component, OnInit, HostListener } from '@angular/core';
//import { MenuComponent } from '../menu/menu.component';


@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.sass']
})
export class NavigationComponent implements OnInit {
	screenWidth: number;
	isSmallScreen: boolean;
	shouldSmScreenHideMenu: boolean;
	contentDivStyle: {};

  constructor() { }

  ngOnInit(): void {
		this.getScreenSize();
	}

	hideOrShowForScreenSize() : void {
		const wasSmallScreen = this.isSmallScreen;
		this.isSmallScreen = this.screenWidth <= 640;

		if(!this.isSmallScreen) { //wasSmallScreen is irrelevant
			this.shouldSmScreenHideMenu = false;
		}
		else if(this.isSmallScreen && !wasSmallScreen) {
			this.shouldSmScreenHideMenu = true;
		}
		//implied else if this.isSmallScreen && wasSmallScreen
		//-> leave shouldSmScreenHideMenu to whatever it is
		
	}
	
	@HostListener('window:resize')
	getScreenSize() : void {
		this.screenWidth = window.innerWidth;
		this.hideOrShowForScreenSize();
		const contentDivSize = this.isSmallScreen ? 
			this.screenWidth : this.screenWidth - 200;
		this.contentDivStyle = {'width': `${contentDivSize}px`};
	}

	menuOpenClick() : void {
		this.shouldSmScreenHideMenu = !this.shouldSmScreenHideMenu;
	}

}
