import { InjectionToken } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SelectOptionComponent } from './select-option/select-option.component';
import { SelectRegistration } from './select-registration';


export interface SelectConfig {
	allowMultiSelect: boolean,
	controlName: string,
	onClickCallback: (option: SelectOptionComponent) => void,
	register: () => SelectRegistration,
	selectedSet: Set<unknown>
};

export const SELECT_CONFIG = 
	new InjectionToken<BehaviorSubject<SelectConfig>>(
	'select config'
);