import { Component, HostListener } from '@angular/core';
import { allRoutes } from './routeDefintions';

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
	routeDescriptions = allRoutes;
	
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

	getOutsideWidth(el: HTMLElement) {
		const styleObj = window.getComputedStyle(el);
		let widthSum = parseFloat(styleObj.paddingLeft);
		widthSum += parseFloat(styleObj.paddingRight);
		widthSum += parseFloat(styleObj.marginLeft);
		widthSum += parseFloat(styleObj.marginRight);
		widthSum += parseFloat(styleObj.borderLeftWidth);
		widthSum += parseFloat(styleObj.borderRightWidth);
		return widthSum;
	}
	
	@HostListener('window:resize')
	getScreenSize() : void {
		this.screenWidth = window.innerWidth;
		this.hideOrShowForScreenSize();
		const el = document.getElementById('content-base');
		const outsideWidth = this.getOutsideWidth(el);
		const contentDivSize = this.isSmallScreen ? 
			(this.screenWidth - outsideWidth) : 
			(this.screenWidth - 200 - outsideWidth);
		
		this.contentDivStyle = {
			'width': `${contentDivSize}px`,
			'float': this.isSmallScreen ? 'none' : 'right',
		};
	}

	menuOpenClick() : void {
		this.shouldSmScreenHideMenu = !this.shouldSmScreenHideMenu;
	}
}
