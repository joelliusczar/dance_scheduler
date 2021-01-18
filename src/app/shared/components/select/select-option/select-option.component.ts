import { Component, 
	ElementRef, 
	Host, 
	Inject, 
	Input, 
	OnInit,    
	SimpleChanges,    
	ViewChild, 
} from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DataBasic } from 'src/app/types/IdSelectable';
import { SelectConfig, SELECT_CONFIG } from '../select-config';


@Component({
  selector: 'app-select-option',
  templateUrl: './select-option.component.html',
  styleUrls: ['./select-option.component.sass']
})
export class SelectOptionComponent implements OnInit {

	@Input('multiple') allowMultiSelect: boolean = false;
	@Input('value') option: DataBasic;
	@Input('selected') selected: boolean;
	@Input('name') controlName: string;
	@Input('tabindex') tabNum = -1;
	@Input('test') test: string;
	onClickCallback: (option: DataBasic) => void = null;

	//this is for outside to mess with
	@ViewChild('optionElement') elementRef: ElementRef;

  constructor(
		@Inject(SELECT_CONFIG) 
		private selectConfig$: BehaviorSubject<SelectConfig | null>) 
	{ 
		
	}

  ngOnInit(): void {
		console.log(`${this.test} init`)
		this.selectConfig$.subscribe((config: SelectConfig) => {
			if(!config) return;
			console.log(`option ${config.controlName}_ ${this.test}_`);
			const registration = config.register();
			//console.log(registration);
			this.allowMultiSelect = config.allowMultiSelect;
			this.controlName = `option-${config.controlName}-${Date.now()}`;
			this.onClickCallback = config.onClickCallback;
		});
	}

	onClick(): void {
		console.log('hi');
		console.log(this);
		this.onClickCallback && this.onClickCallback(this.option);
	}
	
}
