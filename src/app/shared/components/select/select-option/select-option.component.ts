import { Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';
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
	@Input('tabindex') tabNum = -1;
	menuItemClasses = MENU_ITEM_CLASSES_DEFAULT;

	@ViewChild('optionElement') elementRef: ElementRef;

  constructor() { }

  ngOnInit(): void {
	}
	
}
