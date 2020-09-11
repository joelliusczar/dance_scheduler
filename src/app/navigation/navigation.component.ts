import { Component, OnInit, HostListener } from '@angular/core';
//import { MenuComponent } from '../menu/menu.component';


@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.sass']
})
export class NavigationComponent implements OnInit {
	isSmallScreen: boolean;
	shouldSmScreenHideMenu: boolean

  constructor() { }

  ngOnInit(): void {
		this.hideOrShowForScreenSize();
	}

	hideOrShowForScreenSize() : void {
		const wasSmallScreen = this.isSmallScreen;
		this.isSmallScreen = window.innerWidth <= 640;

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
		this.hideOrShowForScreenSize();
	}

	menuOpenClick() : void {
		this.shouldSmScreenHideMenu = !this.shouldSmScreenHideMenu;
	}

}
