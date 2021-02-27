import { Component, 
	ElementRef, 
	Inject, 
	Input, 
	OnInit,      
	ViewChild, 
} from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { nodeFirst } from 'src/app/shared/utils/domHelper';
import { DSInput } from 'src/app/types/ds-input';
import { SelectConfig, SELECT_CONFIG } from '../select-config';


@Component({
  selector: 'app-select-option',
  templateUrl: './select-option.component.html',
  styleUrls: ['./select-option.component.sass']
})
export class SelectOptionComponent implements OnInit, DSInput {

	@Input('multiple') allowMultiSelect: boolean = false;
	@Input('value') value: unknown;
	@Input('selected') selected: boolean;
	@Input('name') controlName: string;
	@Input('tabindex') tabNum = -1;
	content = '';
	onClickCallback: (option: SelectOptionComponent) => void;

	private inialized: boolean;

	//this is for outside to mess with
	@ViewChild('optionElement') elementRef: ElementRef;

  constructor(private elRef: ElementRef,
		@Inject(SELECT_CONFIG) 
		private selectConfig$: BehaviorSubject<SelectConfig | null>) 
	{}

  ngOnInit(): void {
		this.selectConfig$.subscribe((config: SelectConfig) => {
			if(!config) return;
			if(!this.inialized) {
				this.inialized = true;
				const registration = config.register();
				this.allowMultiSelect = config.allowMultiSelect;
				this.controlName = `option-${config.controlName}-${registration.idx}`;
				this.onClickCallback = config.onClickCallback;
			}
			this.selected = config.selectedSet?.has(this.value);
		});
	}

	ngAfterViewChecked(): void {
		const first = nodeFirst(this.elRef?.nativeElement?.children);
		this.content = first?.textContent || '';
	}

	onClick(): void {
		this.onClickCallback && this.onClickCallback(this);
	}
	
}
