import { InjectionToken } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DSInput } from 'src/app/types/ds-input';
import { SelectRegistration } from './select-registration';


export interface TagsConfig {
	controlName: string,
	onClickCallback: (option: DSInput) => void,
	register: () => SelectRegistration,
	showXButton: boolean,
};

export const TAGS_CONFIG = 
	new InjectionToken<BehaviorSubject<TagsConfig>>(
	'tag config'
);