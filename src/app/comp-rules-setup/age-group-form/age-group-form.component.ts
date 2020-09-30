import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Unsubscribable } from 'rxjs';
import { RulesService, AgeGroupType, plus } from '../../rules/rules.service';

@Component({
  selector: 'age-group-form',
  templateUrl: './age-group-form.component.html',
  styleUrls: ['./age-group-form.component.sass']
})
export class AgeGroupFormComponent implements OnInit, OnDestroy {

	ruleServiceUnsub: Unsubscribable;
	ageGroups: Array<AgeGroupType>;
	
	toAge: number | plus | ''

  constructor(private rulesService$: RulesService) { 
		this.ageGroups = [];
	}

  ngOnInit(): void {
		this.ruleServiceUnsub = this.rulesService$.subscribe(
			(value: AgeGroupType[]) => {
				this.ageGroups = value;
		});
	}
	
	toAgeOnChange(newValue: string, form: FormGroup): void {
		const allowedInputs = /(^[1-9]\d*$)|(^\+$)|(^0$)/;
		//if input is valid, we update model 
		//else we revert the control
		if(allowedInputs.test(newValue)) {
			if(newValue === '+') {
				this.toAge = newValue;
			}
			else {
				this.toAge = parseInt(newValue);
			}
		}
		else if(!newValue) {
			this.toAge = '';
		}
		else {
			form.patchValue({ 'toAge': this.toAge}, {'emitEvent': false});
		}
		
	}

	unboundedAgeClick(form: FormGroup): void {
		this.toAge = '+';
		form.patchValue({ 'toAge': this.toAge}, {'emitEvent': false});
	}

	onSubmit(form: FormGroup): void {
		console.log(form);
		if(!form.valid){
			form.markAllAsTouched();
		}
		else {
			this.rulesService$.SaveAgeGroup({
				...form.value, 
				toAge: parseInt(form.value.toAge)
			});
			form.reset({}, {emitEvent: false});
		}
	}

	onRowRemoveClick(group) {
		this.rulesService$.RemoveAgeGroup(group);
	}

	ngOnDestroy(): void {
		this.ruleServiceUnsub.unsubscribe();
	}

}
