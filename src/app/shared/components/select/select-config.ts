import { InjectionToken } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DataBasic } from 'src/app/types/data-basic';

export interface SelectRegistration {
	idx: number
};

export interface SelectConfig {
	allowMultiSelect: boolean,
	controlName: string,
	onClickCallback: (option: DataBasic) => void,
	register: () => SelectRegistration,
	selectedSet: Set<DataBasic>
};

export const SELECT_CONFIG = 
	new InjectionToken<BehaviorSubject<SelectConfig | null>>(
	'select config'
);