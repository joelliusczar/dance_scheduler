import { Directive } from '@angular/core';
import { 
NG_VALIDATORS, 
ValidationErrors, 
AbstractControl, 
Validator,
NgForm
} 
from '@angular/forms';
import { Input } from '@angular/core';

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
		return null;

	}

}
