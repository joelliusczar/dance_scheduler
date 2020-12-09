import { Component, 
	ElementRef, 
	EventEmitter, 
	HostListener, 
	Input, 
	OnInit, 
	Output, 
	QueryList, 
	ViewChildren} from '@angular/core';
import { OptionInfo } from '../../../types/option-info';
import { 
	MENU_ITEM_CLASSES_DEFAULT, 
	MENU_ITEM_CLASSES_HIGHLIGHTED, 
	SelectOptionComponent } 
from './select-option/select-option.component';

const closedMenuClass = 'menu-container-closed';
const openMenuClass = 'menu-container-open';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.sass']
})
export class SelectComponent implements OnInit {

	@Input('name') controlName: string;
	@Input('options') options: OptionInfo[];
	@Input('value') selectedItems: OptionInfo[] | OptionInfo;
	@Input('multiple') allowMultiSelect: boolean;
	@Output('onSelected') onSelected = new EventEmitter<OptionInfo[]>() 
	selectedSet: Set<OptionInfo>;
	isOpen = false;
	containerClass = closedMenuClass;
	defaultDisplay = 'Select...';
	highlightedMenuItemIdx: number = -1;

	@ViewChildren(SelectOptionComponent) optionElements: QueryList<SelectOptionComponent>;

  constructor(private elRef: ElementRef) { }

  ngOnInit(): void {
		if(this.allowMultiSelect) {
			if(Array.isArray(this.selectedItems)) {
				this.selectedSet = new Set(this.selectedItems);
			}
			else {
				throw Error('When using multi-select, provided value must be array');
			}
		}
		else {
			if(!Array.isArray(this.selectedItems)) {
				//I've arbitrarily decided I want the internal representation 
				//to always be an array 
				this.selectedItems = [this.selectedItems];
				this.selectedSet = new Set(this.selectedItems);
			}
			else if(this.selectedItems.length <= 1) {
				this.selectedSet = new Set(this.selectedItems);
			}
			else {
				throw Error('When not using multi-select, '
					+ 'provided value cannot be array with more than 1 item.');
			}
		}
	}

	private openMenu(): void {
		this.isOpen = true;
		this.containerClass = openMenuClass;
	}

	private closeMenu(): void {
		this.isOpen = false;
		this.containerClass = closedMenuClass;
		this.highlightedMenuItemIdx = -1;
	}
	
	@HostListener('document:click',['$event'])
	clickout(event) {
		const element = this.elRef.nativeElement.children[0] as HTMLElement;
		if(element.contains(event.target)) {
			this.openMenu();
		}
		else {
			this.closeMenu();
		}
	}

	private arrowHighlightIfNone(): boolean {
		if(this.highlightedMenuItemIdx === -1) {
			this.highlightedMenuItemIdx = 0;
			this.optionElements.first.menuItemClasses = MENU_ITEM_CLASSES_HIGHLIGHTED;
			return true;
		}
		return false;
	}

	private swapMenuOptionHighlight(oldIdx: number, newIdx: number): void {
		const optionsElementsArr = this.optionElements.toArray();
		const currentHighlighted = optionsElementsArr[oldIdx];
		const nextHighlighted = optionsElementsArr[newIdx];
		currentHighlighted.menuItemClasses = MENU_ITEM_CLASSES_DEFAULT;
		nextHighlighted.menuItemClasses = MENU_ITEM_CLASSES_HIGHLIGHTED;
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
				option.menuItemClasses = MENU_ITEM_CLASSES_HIGHLIGHTED;
				this.highlightedMenuItemIdx = newIdx;
			}
		}
	}

	private openMenuKeydownEventBranches(e: KeyboardEvent) {
		console.log(e.key);
		if(e.key === 'Enter' && this.highlightedMenuItemIdx > -1) {
			const optionElements = this.optionElements.toArray();
			const optionElement = optionElements[this.highlightedMenuItemIdx];
			const tagInfo = optionElement.option;
			this.onChecked(tagInfo);
		}
		else if(e.key === 'Tab') {
			this.closeMenu();
		}
		if(e.key === 'ArrowUp' && !this.arrowHighlightIfNone()) {
			const idx = this.highlightedMenuItemIdx;
			if(idx > 0) {
				this.swapMenuOptionHighlight(idx, idx - 1);
			}
			e.preventDefault();	
		}
		else if(e.key === 'ArrowDown' && !this.arrowHighlightIfNone()) {
			const idx = this.highlightedMenuItemIdx;
			if(idx < this.optionElements.length -1) {
				this.swapMenuOptionHighlight(idx, idx + 1);
			}
			e.preventDefault();
		}
		else {
			this.highlightSearchedOption(e);
		}
	}


	@HostListener('window:keydown',['$event'])
	onKeyDown(e: KeyboardEvent): void {
		const element = this.elRef.nativeElement.children[0];
		if(element === document.activeElement) {
			if(this.isOpen && this.optionElements.length > 0) {
				this.openMenuKeydownEventBranches(e);
			}
			else {
				if(e.key === 'Enter') {
					this.openMenu();
				}
			}
		}
	}

	showSelectedList(): boolean {
		if(this.allowMultiSelect) {
			const selectedArray = this.selectedItems as OptionInfo[];
			return selectedArray && selectedArray.length > 0;
		}
		return false;
	}

	isOptionChecked(option: OptionInfo): boolean {
		return this.selectedSet && this.selectedSet.has(option);
	}

	private replaceValues(selected: OptionInfo[]): void {
		this.selectedItems = selected;
		this.selectedSet = new Set(selected);
		this.onSelected.emit([...selected]);
	}

	private toggleOptionMulti(option: OptionInfo): void {
		const selectedArray = this.selectedItems as OptionInfo[];
		const items = selectedArray.filter(t => t.display !== option.display);
		//if no items were matched to be removed, then add instead
		if(items.length === selectedArray.length) {
			items.push(option);
		}
		this.replaceValues(items);
	}

	private toggleOptionSingle(option: OptionInfo): void {
		this.replaceValues([option]);
		this.closeMenu();
		const element = this.elRef.nativeElement.children[0] as HTMLElement;
		element.blur();
	}

	onChecked(option: OptionInfo): void {
		if(this.allowMultiSelect) {
			this.toggleOptionMulti(option);
		}
		else {
			this.toggleOptionSingle(option);
		}
	}

	onTagXClicked(e: MouseEvent, option: OptionInfo) {
		this.toggleOptionMulti(option);
		e.stopPropagation();
	}

	getSingularDisplayValue(): string {
		const selected = this.selectedItems as OptionInfo[];
		return selected[0] ? selected[0].display : this.defaultDisplay;
	}
}
