import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { RulesService, AgeGroupType } from '../../rules/rules.service';

@Component({
  selector: 'age-group-form',
  templateUrl: './age-group-form.component.html',
  styleUrls: ['./age-group-form.component.sass']
})
export class AgeGroupFormComponent implements OnInit {

	ageGroups: Array<AgeGroupType>;
	
	defaultAgeGroupModel: AgeGroupType = {
		name: '',
		fromAge: 0,
		toAge: 0,
	};

	ageGroupModel: AgeGroupType = {...this.defaultAgeGroupModel }

  constructor(private rulesService: RulesService) { 
		this.ageGroups = [];
	}

  ngOnInit(): void {
	}
	
	toAgeOnChange(newValue: string, form: FormGroup): void {
		const allowedInputs = /(^[1-9]\d*$)|(^\+$)|(^0$)/;
		console.log('change');
		//if input is valid, we update model 
		//else we revert the control
		if(allowedInputs.test(newValue)) {
			if(newValue === '+') {
				this.ageGroupModel.toAge = newValue;
			}
			else {
				this.ageGroupModel.toAge = parseInt(newValue);
			}
		}
		else if(!newValue) {
			this.ageGroupModel.toAge = '';
		}
		else {
			form.patchValue({ 'toAge': this.ageGroupModel.toAge}, {'emitEvent': false});
		}
		
	}

	unboundedAgeClick(): void {
		this.ageGroupModel.toAge = '+';
	}

	onSubmit(form: FormGroup): void {
		if(!form.valid){
			form.markAllAsTouched();
		}
		else {
			this.rulesService.SaveAgeGroup({...form.value});
			this.ageGroupModel = {...this.defaultAgeGroupModel};
			form.reset(this.ageGroupModel, {emitEvent: false});
		}
	}

}
