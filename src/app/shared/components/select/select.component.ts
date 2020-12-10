import { Component, 
	ElementRef, 
	EventEmitter, 
	forwardRef, 
	HostListener, 
	Input, 
	OnInit, 
	Output, 
	QueryList, 
	ViewChildren} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { noop } from 'rxjs';
import { OptionInfo } from '../../../types/option-info';
import { 
	MENU_ITEM_CLASSES_DEFAULT, 
	MENU_ITEM_CLASSES_HIGHLIGHTED, 
	SelectOptionComponent } 
from './select-option/select-option.component';

const closedMenuClass = 'menu-container-closed';
const openMenuClass = 'menu-container-open';
const disabledMenuClass = 'menu-container-disabled';

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
  selector: 'app-select',
  templateUrl: './select.component.html',
	styleUrls: ['./select.component.sass'],
	providers: [{
		provide: NG_VALUE_ACCESSOR,
		useExisting: forwardRef(() => SelectComponent),
		multi: true,
	}]
})
export class SelectComponent implements OnInit, ControlValueAccessor {

	@Input('name') controlName: string;
	@Input('options') options: OptionInfo[];
	@Input('value') selectedItems: OptionInfo[] | OptionInfo;
	@Input('multiple') allowMultiSelect: boolean;
	@Input('disabled') isDisabled: boolean;
	@Output('onSelected') onSelected = new EventEmitter<OptionInfo[]>() 
	selectedSet: Set<OptionInfo>;
	isOpen = false;
	containerClass = closedMenuClass;
	defaultDisplay = 'Select...';
	highlightedMenuItemIdx: number = -1;
	tabNum: number;
	propagateChange: (_: any) => {};
	propagateTouch: () => void;

	@ViewChildren(SelectOptionComponent) optionElements: QueryList<SelectOptionComponent>;

	constructor(private elRef: ElementRef) {}
	
	ngOnInit(): void {
		this.initializeSelectedValues(this.selectedItems);
		if(this.isDisabled) {
			this.tabNum = -1;
			this.containerClass = disabledMenuClass;
		}
	}

	writeValue(obj: any): void {
		console.log(obj);
		const valueAs = obj as OptionInfo[] | OptionInfo;
		this.initializeSelectedValues(valueAs);
	}

	registerOnChange(fn: any): void {
		this.propagateChange = fn;
	}

	registerOnTouched(fn: any): void {
		this.propagateTouch = fn;
	}

	setDisabledState?(isDisabled: boolean): void {
		this.isDisabled = isDisabled;
		this.tabNum = isDisabled ? -1 : 0;
		this.containerClass = disabledMenuClass;
	}

	private initializeSelectedValues(selectedItems: OptionInfo[] | OptionInfo) {
		if(this.allowMultiSelect) {
			if(Array.isArray(selectedItems)) {
				this.selectedSet = new Set(selectedItems);
			}
			else {
				throw Error('When using multi-select, provided value must be array');
			}
		}
		else {
			if(!Array.isArray(selectedItems)) {
				//I've arbitrarily decided I want the internal representation 
				//to always be an array 
				this.selectedItems = [selectedItems];
				this.selectedSet = new Set(this.selectedItems);
			}
			else if(selectedItems.length <= 1) {
				this.selectedSet = new Set(selectedItems);
			}
			else {
				throw Error('When not using multi-select, '
					+ 'provided value cannot be array with more than 1 item.');
			}
		}
	}

	private openMenu(): void {
		if(this.isDisabled) return;
		this.isOpen = true;
		this.containerClass = openMenuClass;
		//this.arrowHighlightIfNone();
	}

	private closeMenu(): void {
		this.isOpen = false;
		this.containerClass = closedMenuClass;
		this.highlightedMenuItemIdx = -1;
	}
	
	onFocus(): void {
		this.openMenu();
	}

	onBlur(): void {
		//this timeout is a hack.
		//we don't want the blur action to occur if a child is focused
		//especially since it will occur as we tab through the options
		//we can check for active element, but first focus goes to body
		//before switching to our element. the setTimeout tosses our work to the end 
		//of the queue so that by then the activeElement is our option
		setTimeout(() => {
			const element = this.elRef.nativeElement.children[0] as HTMLElement;
			if(!element.contains(document.activeElement)) {
				this.closeMenu();
			}
		})
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
		this.propagateChange && this.propagateChange([...selected]);
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
