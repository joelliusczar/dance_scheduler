import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, Validator, FormControl, Validators } from '@angular/forms';
import { Subscription, Unsubscribable } from 'rxjs';
import { 
	AgeRangeValidatorDirective 
} from '../../validators/age-range-validator.directive';
import { Direction, DirectionEventArg } from '../../types/directions';
import { CompetitionSetupService } from 'src/app/services/competition-setup/competition-setup.service';
import { AgeGroupType, Competition, plus } from 'src/app/types/data-shape';


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
	compSetupServiceUnsub: Unsubscribable;
	ageGroups: AgeGroupType[];
	submitValidators: Validator[];
	toAgeSubscription: Subscription;
	direction = Direction;
	
	prevToAge: number | plus | ''

  constructor( private competitionSetup$: CompetitionSetupService) { 
		this.ageGroups = [];
		this.submitValidators = [new AgeRangeValidatorDirective()];
		this.toAgeSubscription = 
			this.toAge.valueChanges.subscribe(this.toAgeOnChange.bind(this));
	}

  ngOnInit(): void {
		this.compSetupServiceUnsub = this.competitionSetup$
		.subscribe((value: Competition) => {
				this.ageGroups = value.ageGroups;
			}
		);
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

	reorderClick(eventArg: DirectionEventArg<AgeGroupType>): void {
		this.competitionSetup$.moveAgeGroup(eventArg.item, eventArg.direction);
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
			this.competitionSetup$.SaveAgeGroup({
				...this.ageGroupFormGroup.value, 
				toAge: toAge === '+' ? '+' : parseInt(toAge)
			});
			this.ageGroupFormGroup.reset({}, {emitEvent: false});
		}
	}

	onRowRemoveClick(item) {
		this.competitionSetup$.removeAgeGroup(item);
	}

	ngOnDestroy(): void {
		this.toAgeSubscription.unsubscribe();
		this.compSetupServiceUnsub.unsubscribe();
	}

}
