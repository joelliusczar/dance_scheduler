import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { RulesService, AgeGroupType } from '../../rules/rules.service';

@Component({
  selector: 'age-group-form',
  templateUrl: './age-group-form.component.html',
  styleUrls: ['./age-group-form.component.sass']
})
export class AgeGroupFormComponent implements OnInit {

  ageGroups: Array<AgeGroupType>;

	ageGroupModel: AgeGroupType ={
		name: '',
		fromAge: 0,
		toAge: 0,
	};
	@ViewChild('toAgeInput') toAgeInput: ElementRef;

  constructor(private rulesService: RulesService) { 
		this.ageGroups = [];
	}

  ngOnInit(): void {
	}
	
	toAgeOnChange(newValue: string) {
		const allowedInputs = /(^[1-9]\d*$)|(^\+$)/;

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
			this.toAgeInput.nativeElement.value = this.ageGroupModel.toAge;
		}
		
	}

	unboundedAgeClick() {
		this.ageGroupModel.toAge = '+';
	}

	onSubmit(values) {
		console.log(values);
	}

}
