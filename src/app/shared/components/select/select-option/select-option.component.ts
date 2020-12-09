import { Component, HostListener, Input, OnInit } from '@angular/core';
import { OptionInfo } from 'src/app/types/option-info';

export const MENU_ITEM_CLASSES_DEFAULT = 'menu-item';
export const MENU_ITEM_CLASSES_HIGHLIGHTED = 'menu-item highlighted-menu-item';

@Component({
  selector: 'app-select-option',
  templateUrl: './select-option.component.html',
  styleUrls: ['./select-option.component.sass']
})
export class SelectOptionComponent implements OnInit {

	@Input('multiple') allowMultiSelect: boolean;
	@Input('option') option: OptionInfo;
	@Input('selected') selected: boolean;
	@Input('name') controlName: string;
	menuItemClasses = MENU_ITEM_CLASSES_DEFAULT;

  constructor() { }

  ngOnInit(): void {
	}
	
	@HostListener('mouseenter') 
	onMouseEnter(): void {
		this.menuItemClasses = MENU_ITEM_CLASSES_HIGHLIGHTED;
	}

	@HostListener('mouseleave')
	onMouseLeave(): void {
		this.menuItemClasses = MENU_ITEM_CLASSES_DEFAULT;
	}

}
