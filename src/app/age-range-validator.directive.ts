import { Directive } from '@angular/core';
import { NG_VALIDATORS, ValidationErrors, AbstractControl } from '@angular/forms';

@Directive({
	selector: '[dsAgeRangeValidator]',
	providers: [ { 
		provide: NG_VALIDATORS,
		useExisting: AgeRangeValidatorDirective, 
		multi: true
	}]
})
export class AgeRangeValidatorDirective {

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
		
		return fromAge > toAge ? { invalidAgeRange: true } : null;

	}

}
