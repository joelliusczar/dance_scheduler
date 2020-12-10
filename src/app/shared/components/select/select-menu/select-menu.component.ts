import { Component, EventEmitter, HostListener, Input, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { noop } from 'rxjs';
import { OptionInfo } from 'src/app/types/option-info';
import { SelectOptionComponent } from '../select-option/select-option.component';


const skippedKeys = new Set([
	'Backspace',
	'Tab',
	'F1',
	'F1',
	'F2',
	'F3',
	'F4',
	'F5',
	'F6',
	'F7',
	'F8',
	'F9',
	'F10',
	'F11',
	'F12'
]);

@Component({
  selector: 'app-select-menu',
  templateUrl: './select-menu.component.html',
  styleUrls: ['./select-menu.component.sass']
})
export class SelectMenuComponent implements OnInit {

	@Input('name') controlName: string;
	@Input('options') options: OptionInfo[];
	@Input('multiple') allowMultiSelect: boolean;
	@Input('isOpen') isOpen = false;
	@Output('onSelected') onSelected = new EventEmitter<OptionInfo[]>() 
	highlightedMenuItemIdx: number = -1;

	@ViewChildren(SelectOptionComponent) optionElements: QueryList<SelectOptionComponent>;

  constructor() { }

  ngOnInit(): void {
	}
	
	private arrowHighlightIfNone(): boolean {
		if(this.highlightedMenuItemIdx === -1) {
			this.highlightedMenuItemIdx = 0;
			this.optionElements.first.elementRef.nativeElement.focus();
			return true;
		}
		return false;
	}

	private swapMenuOptionHighlight(oldIdx: number, newIdx: number): void {
		const optionsElementsArr = this.optionElements.toArray();
		const nextHighlighted = optionsElementsArr[newIdx];
		nextHighlighted.elementRef.nativeElement.focus();
		this.highlightedMenuItemIdx = newIdx;
	}

	private highlightSearchedOption(e: KeyboardEvent) {
		const optionElements = this.optionElements.toArray();
		const idx = this.highlightedMenuItemIdx;
		const newIdx = optionElements.findIndex(
			(option: SelectOptionComponent) => {
				const upKey = e.key.toLocaleUpperCase();
				const upStr = option.option.display.toLocaleUpperCase()
				return upStr.startsWith(upKey);
		});
		if(newIdx > -1) {
			if(idx > -1) {
				this.swapMenuOptionHighlight(idx, newIdx);
			}
			else {
				const option = optionElements[newIdx];
				//option.menuItemClasses = MENU_ITEM_CLASSES_HIGHLIGHTED;
				option.elementRef.nativeElement.focus();
				this.highlightedMenuItemIdx = newIdx;
			}
		}
	}

	private openMenuKeydownEventBranches(e: KeyboardEvent) {
		console.log(e.key);
		if(e.key === ' ' && this.highlightedMenuItemIdx > -1) {
			const optionElements = this.optionElements.toArray();
			const optionElement = optionElements[this.highlightedMenuItemIdx];
			const tagInfo = optionElement.option;
			this.onChecked(tagInfo);
		}
		else if(e.key === 'ArrowUp') {
			const idx = this.highlightedMenuItemIdx;
			if(idx > 0) {
				this.swapMenuOptionHighlight(idx, idx - 1);
			}
			e.preventDefault();	
		}
		else if(e.key === 'ArrowDown' && ! this.arrowHighlightIfNone()) {
			const idx = this.highlightedMenuItemIdx;
			if(idx < this.optionElements.length -1) {
				this.swapMenuOptionHighlight(idx, idx + 1);
			}
			e.preventDefault();
		}
		else if(skippedKeys.has(e.key)) {
			noop();
		}
		else {
			this.highlightSearchedOption(e);
		}
	}


	@HostListener('window:keydown',['$event'])
	onKeyDown(e: KeyboardEvent): void {
		if(this.isOpen && this.optionElements.length > 0) {
			this.openMenuKeydownEventBranches(e);
		}
		else {
			// if(e.key === 'Enter') {
			// 	this.openMenu();
			// }
		}
	}

	onChecked(option: OptionInfo): void {
		
	}

}
