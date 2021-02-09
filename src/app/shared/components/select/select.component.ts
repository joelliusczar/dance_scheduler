import { ContentChildren, Inject } from '@angular/core';
import { Component, 
	ElementRef, 
	EventEmitter, 
	forwardRef, 
	HostListener, 
	Input, 
	OnInit, 
	Output, 
	QueryList, 
	SimpleChange } from '@angular/core';
import { AbstractControl, ControlValueAccessor, 
	NG_VALIDATORS, 
	NG_VALUE_ACCESSOR } from '@angular/forms';
import { BehaviorSubject, noop } from 'rxjs';
import { DataBasic } from 'src/app/types/IdSelectable';
import { isEmptyStr } from '../../utils/anyHelper';
import { asArray } from '../../utils/arrayHelpers';
import { focusNext } from '../../utils/domHelper';
import { SelectConfig, SELECT_CONFIG } from './select-config';
import { 
	SelectOptionComponent } 
from './select-option/select-option.component';

const closedMenuClass = 'menu-container-closed ds-select';
const openMenuClass = 'menu-container-open ds-select';
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
	},
	{
		provide: SELECT_CONFIG,
		useFactory: () => new BehaviorSubject<SelectConfig | null>(null)
	},
	{
		provide: NG_VALIDATORS,
		useExisting: forwardRef(() => SelectComponent),
		multi: true,
	}
]
})
export class SelectComponent implements OnInit, ControlValueAccessor {

	@Input('name') controlName: string = '';
	@Input('options') options: DataBasic[];
	@Input('value') selectedItems: DataBasic[];
	@Input('multiple') allowMultiSelect: boolean = false;
	@Input('disabled') isDisabled: boolean;
	@Input('defaultDisplay') defaultDisplay: string = 'Select...';
	@Output('onSelected') onSelected = new EventEmitter<DataBasic[]>(); 
	isOpen: boolean = false;
	topId: string = '';
	selectedSet: Set<DataBasic>;
	containerClass: string = closedMenuClass;
	highlightedMenuItemIdx: number = -1;
	tabNum: number;
	propagateChange: (_: any) => {};
	propagateTouch: () => void;
	hasError: boolean = false;
	optionMaxIdx: number = 0; 
	selectConfig: SelectConfig;


	@ContentChildren(SelectOptionComponent) 
	optionElements: QueryList<SelectOptionComponent>;

	constructor(private elRef: ElementRef, 
		@Inject(SELECT_CONFIG) 
		private selectConfig$: BehaviorSubject<SelectConfig | null>) 
	{ }
	
	ngOnInit(): void {
		this._initializeSelectedValues(this.selectedItems);
		this.topId = `ds-select-top-${this.controlName}`;
		this.selectConfig = {
			allowMultiSelect: this.allowMultiSelect,
			controlName: this.controlName,
			onClickCallback: this.onChecked.bind(this),
			register: () => ({ idx: this.optionMaxIdx++ }),
			selectedSet: this.selectedSet,
		};
		this.selectConfig$.next(this.selectConfig);
		if(this.isDisabled) {
			this.tabNum = -1;
			this.containerClass = disabledMenuClass;
		}
	}

	ngOnChanges(changes: SimpleChange) {
		const optionChanges = changes['options'];
		if(optionChanges && !optionChanges.firstChange) {
			const prevLength = optionChanges.previousValue?.length;
			//if something was deleted
			if(prevLength > optionChanges.currentValue?.length) {
				const current = optionChanges.currentValue
					.map(o => o.key);
				const currentSet = new Set(current);
				const selected = asArray(this.selectedItems)
					.filter(o => currentSet.has(o.id));
				this.selectedItems = selected;
				this.selectedSet = new Set(selected);
			}
		}
  }

	writeValue(obj: any): void {
		const valueAs = obj as DataBasic[] | DataBasic;
		this._initializeSelectedValues(valueAs);
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

	validate(control: AbstractControl): any {
		const validity = (control.value as [])?.length < 1 ? {} : null;
		return validity;
	}

	private _initializeSelectedValues(selectedItems: DataBasic[] | any) {
		if(this.allowMultiSelect) {
			if(Array.isArray(selectedItems)) {
				this.selectedItems = selectedItems;
				this.selectedSet = new Set(selectedItems);
			}
			else if(isEmptyStr(selectedItems)) {
				this.selectedItems = [];
				this.selectedSet = new Set(this.selectedItems);
				this.propagateChange && this.propagateChange([]);
			}
			else {
				throw Error('When using multi-select, provided value must be array');
			}
		}
		else {
			if(!Array.isArray(selectedItems)) {
				//I've arbitrarily decided I want the internal representation 
				//to always be an array 
				this.selectedItems = !isEmptyStr(selectedItems) ? [selectedItems] : [];
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
		this.selectConfig = {...this.selectConfig,
			selectedSet: this.selectedSet
		};
		this.selectConfig$.next(this.selectConfig);
	}

	private _openMenu(): void {
		if(this.isDisabled || this.options?.length < 1) return;
		this.isOpen = true;
		this.containerClass = openMenuClass;
	}

	private _closeMenu(): void {
		this.isOpen = false;
		this.containerClass = closedMenuClass;
		this.highlightedMenuItemIdx = -1;
		this.propagateTouch && this.propagateTouch();
	}
	
	onFocus(): void {
		this._openMenu();
	}

	//this needs to be a focusout rather than a simple blur
	//because we want to get the focus event of the options themselves
	//otherwise, if an option is selected and we click out, this wont fire
	onFocusOut(): void {
		//this timeout is a hack.
		//we don't want the blur action to occur if a child is focused
		//especially since it will occur as we tab through the options
		//we can check for active element, but first focus goes to body
		//before switching to our element. the setTimeout tosses our work to the end 
		//of the queue so that by then the activeElement is our option

		setTimeout(() => {
			const element = this.elRef.nativeElement.children[0] as HTMLElement;
			if(!element.contains(document.activeElement)) {
				this._closeMenu();
			}
		});
	}

	private _menuOptionHighlight(newIdx: number): void {
		const optionsElementsArr = this.optionElements.toArray();
		const nextHighlighted = optionsElementsArr[newIdx];
		nextHighlighted.elementRef.nativeElement.focus();
		this.highlightedMenuItemIdx = newIdx;
	}

	private _highlightSearchedOption(e: KeyboardEvent) {
		const optionElements = this.optionElements.toArray();
		const idx = this.highlightedMenuItemIdx;
		const newIdx = optionElements.findIndex(
			(option: SelectOptionComponent) => {
				if(!option.option) return false;
				const upKey = e.key.toLocaleUpperCase();
				const upStr = option.option.name.toLocaleUpperCase()
				return upStr.startsWith(upKey);
		});
		if(newIdx > -1) {
			if(idx > -1) {
				this._menuOptionHighlight(newIdx);
			}
			else {
				const option = optionElements[newIdx];
				option.elementRef.nativeElement.focus();
				this.highlightedMenuItemIdx = newIdx;
			}
		}
	}

	private _chooseOption(): void {
		const optionElements = this.optionElements.toArray();
		const optionElement = optionElements[this.highlightedMenuItemIdx];
		optionElement.selected = true;
		const option = optionElement.option;
		this.onChecked(option);
	}

	private _openMenuKeydownEventBranches(e: KeyboardEvent) {
		
		if((e.key === ' ') && this.highlightedMenuItemIdx > -1) {
			this._chooseOption();
			if(!this.allowMultiSelect) {
				const element = this.elRef.nativeElement.children[0];
				focusNext(element);
			}
			e.preventDefault();
		}
		else if(e.key === 'Enter') {
			if(this.allowMultiSelect) {
				this._closeMenu();
			}
			else if(this.highlightedMenuItemIdx > -1) {
				this._chooseOption();
			}
			const element = this.elRef.nativeElement.children[0];
			focusNext(element);
		}
		else if(e.key === 'ArrowUp') {
			const idx = this.highlightedMenuItemIdx;
			if(idx > 0) {
				this._menuOptionHighlight(idx - 1);
			}
			e.preventDefault();	
		}
		else if(e.key === 'ArrowDown') {
			const idx = this.highlightedMenuItemIdx;
			if(idx < this.optionElements.length -1) {
				this._menuOptionHighlight(idx + 1);
			}
			e.preventDefault();
		}
		else if(skippedKeys.has(e.key)) {
			noop();
		}
		else {
			this._highlightSearchedOption(e);
		}
	}


	@HostListener('window:keydown',['$event'])
	onKeyDown(e: KeyboardEvent): void {
		if(this.isOpen && this.optionElements?.length > 0) {
			this._openMenuKeydownEventBranches(e);
		}
	}

	showTagList(): boolean {
		if(this.allowMultiSelect) {
			return this.selectedItems && this.selectedItems.length > 0;
		}
		return false;
	}

	isOptionChecked(option: DataBasic): boolean {
		return this.selectedSet && this.selectedSet.has(option);
	}

	private _replaceValues(selected: DataBasic[]): void {
		this.selectedItems = selected;
		this.selectedSet = new Set(selected);
		this.onSelected.emit([...selected]);
		this.propagateChange && this.propagateChange([...selected]);
		this.selectConfig = {...this.selectConfig,
			selectedSet: this.selectedSet
		};
		this.selectConfig$.next(this.selectConfig);
	}

	private _toggleOptionMulti(option: DataBasic): void {
		const selectedArray = this.selectedItems as DataBasic[];
		const items = selectedArray.filter(t => t.id !== option.id);
		//if no items were matched to be removed, then add instead
		if(items.length === selectedArray.length) {
			items.push(option);
		}
		this._replaceValues(items);
	}

	private _toggleOptionSingle(option: DataBasic): void {
		this._replaceValues(option ? [option] : []);
		this._closeMenu();
	}

	onChecked(option: DataBasic): void {
		console.log('onChecked');
		console.log(option);
		if(this.allowMultiSelect) {
			this._toggleOptionMulti(option);
		}
		else {
			this._toggleOptionSingle(option);
		}
	}

	onTagXClicked(option: DataBasic) {
		this._toggleOptionMulti(option);
		this.propagateTouch && this.propagateTouch();
	}

	getSingularDisplayValue(): string {
		const selected = this.selectedItems as DataBasic[];
		return selected[0] ? selected[0].name : this.defaultDisplay;
	}
}
