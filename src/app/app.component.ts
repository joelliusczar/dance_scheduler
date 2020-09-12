import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {

	screenWidth: number;
	isSmallScreen: boolean;
	shouldSmScreenHideMenu: boolean;
	contentDivStyle: {};

	title = 'Dance Scheduler';
	routeDescriptions = [
		{ path: 'dancers', display: 'Dancers' },
		{ path: 'couples', display: 'Couples' },
		{ path: 'schools', display: 'Schools' },
		{ path: 'skillTiers', display: 'Skill Tiers' },
	];
	
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
		this.contentDivStyle = {
			'width': `${contentDivSize}px`,
			'float': this.isSmallScreen ? 'none' : 'right',
		};
	}

	menuOpenClick() : void {
		this.shouldSmScreenHideMenu = !this.shouldSmScreenHideMenu;
	}
}
