import { Directive } from '@angular/core';
import { 
NG_VALIDATORS, 
ValidationErrors, 
AbstractControl, 
Validator
} 
from '@angular/forms';
import { stripDownObj } from '../shared/utils/objectHelpers';

@Directive({
	selector: '[dsAgeRangeValidator]',
	providers: [ { 
		provide: NG_VALIDATORS,
		useExisting: AgeRangeValidatorDirective, 
		multi: true
	}]
})
export class AgeRangeValidatorDirective implements Validator {


	validate(control: AbstractControl): ValidationErrors | null {
		const fromAgeCtl = control.get('fromAge');
		if(!fromAgeCtl) return null;
		const toAgeCtl = control.get('toAge');
		if(!toAgeCtl) return null;
		if(typeof toAgeCtl.value === 'string') {
			if(toAgeCtl.value.trim() === '+') return null;
		}
		const fromAge: number = fromAgeCtl.value;
		const toAge: number = parseInt(toAgeCtl.value);
		if(fromAge > toAge) {
			const error = { invalidAgeRange: true };
			fromAgeCtl.setErrors(error);
			toAgeCtl.setErrors(error);
			return error;
		}
		const fromErrs = stripDownObj(fromAgeCtl.errors,['invalidAgeRange']);
		fromAgeCtl.setErrors(fromErrs);
		const toErrs = stripDownObj(toAgeCtl.errors,['invalidAgeRange']);
		toAgeCtl.setErrors(toErrs);
		return null;

	}

}
