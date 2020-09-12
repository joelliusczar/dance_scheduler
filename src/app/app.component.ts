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

	title = 'dance-scheduler';
	

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
