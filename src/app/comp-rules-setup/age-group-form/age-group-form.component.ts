import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, Validator, FormControl, Validators } from '@angular/forms';
import { Subscription, Unsubscribable } from 'rxjs';
import {
	AgeGroupService,
	AgeGroupType, 
	plus } from '../../rules/variant.service';
import { 
	AgeRangeValidatorDirective 
} from '../../validators/age-range-validator.directive';
import { ElevatorDir, Direction } from '../../types/directions';


@Component({
  selector: 'age-group-form',
  templateUrl: './age-group-form.component.html',
	styleUrls: ['./age-group-form.component.sass']
})
export class AgeGroupFormComponent implements OnInit, OnDestroy {
	name = new FormControl('');
	fromAge = new FormControl('',[Validators.min(0)]);
	toAge = new FormControl('');
	ageGroupFormGroup = new FormGroup({
		name: this.name,
		fromAge: this.fromAge,
		toAge: this.toAge,
	});
	ruleServiceUnsub: Unsubscribable;
	ageGroups: AgeGroupType[];
	submitValidators: Validator[];
	toAgeSubscription: Subscription;
	direction = Direction;
	
	prevToAge: number | plus | ''

  constructor( private variantService$: AgeGroupService) { 
		this.ageGroups = [];
		this.submitValidators = [new AgeRangeValidatorDirective()];
		this.toAgeSubscription = 
			this.toAge.valueChanges.subscribe(this.toAgeOnChange.bind(this));
	}

  ngOnInit(): void {
		this.ruleServiceUnsub = this.variantService$.subscribe(
			(value: AgeGroupType[]) => {
				this.ageGroups = value;
		});
	}
	
	toAgeOnChange(newValue: string): void {
		if(!this) return;
		const allowedInputs = /(^[1-9]\d*$)|(^\+$)|(^0$)/;
		//if input is valid, we update model 
		//else we revert the control
		if(allowedInputs.test(newValue)) {
			if(newValue === '+') {
				this.prevToAge = newValue;
			}
			else {
				this.prevToAge = parseInt(newValue);
			}
		}
		else if(!newValue) {
			this.prevToAge = '';
		}
		else {
			this.toAge.setValue(this.prevToAge, {'emitEvent': false});
		}
		
	}

	unboundedAgeClick(): void {
		 this.prevToAge = '+';
		 this.toAge.setValue(this.prevToAge, {'emitEvent': false});
	}

	reorderClick(ageGroup: AgeGroupType, direction: ElevatorDir): void {
		this.variantService$.moveItem(ageGroup, direction);
	}

	onSubmit(): void {
		const submitErrors = this.submitValidators.reduce((p, c) => {
			const addErrors = c.validate(this.ageGroupFormGroup);
			return addErrors ? { ...p, ...addErrors } : p;
		},null);
		const existingErrors = this.ageGroupFormGroup.errors;
		if(submitErrors || existingErrors) {
			this.ageGroupFormGroup.setErrors({...existingErrors, ...submitErrors});
		}
		if(!this.ageGroupFormGroup.valid){
			this.ageGroupFormGroup.markAllAsTouched();
		}
		else {
			const toAge = this.ageGroupFormGroup.value.toAge;
			this.variantService$.SaveItem({
				...this.ageGroupFormGroup.value, 
				toAge: toAge === '+' ? '+' : parseInt(toAge)
			});
			this.ageGroupFormGroup.reset({}, {emitEvent: false});
		}
	}

	onRowRemoveClick(item) {
		this.variantService$.RemoveItem(item);
	}

	ngOnDestroy(): void {
		this.toAgeSubscription.unsubscribe();
		this.ruleServiceUnsub.unsubscribe();
	}

}
