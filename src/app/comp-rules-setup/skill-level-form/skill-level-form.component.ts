import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Unsubscribable } from 'rxjs';
import { CompetitionSetupService } from 'src/app/services/competition-setup/competition-setup.service';
import { Competition, SkillLevel } from 'src/app/types/data-shape';
import { DirectionEventArg } from 'src/app/types/directions';

@Component({
  selector: 'app-skill-level-form',
  templateUrl: './skill-level-form.component.html',
  styleUrls: ['./skill-level-form.component.sass']
})
export class SkillLevelFormComponent implements OnInit {

	compSetupServiceUnsub: Unsubscribable;
	skillLevels: SkillLevel[] = [];

	constructor(private competitionSetup$: CompetitionSetupService) 
	{ }

  ngOnInit(): void {
		this.compSetupServiceUnsub = this.competitionSetup$.subscribe(
			(value: Competition) => {
				this.skillLevels = value.skillLevels;
			}
		);
	}

	reorderClick(eventArg: DirectionEventArg<SkillLevel>): void {
		this.competitionSetup$.moveSkillLevel(eventArg.item, eventArg.direction);
	}

	onSubmit(formGroup: FormGroup): void {

		if(!formGroup.valid){
			formGroup.markAllAsTouched();
		}
		else {
			const formVal = formGroup.value;
			this.competitionSetup$.saveSkillLevel({
				...formVal,
				order: null,
				key: null,
			});
			formGroup.reset({}, {emitEvent: false});
		}
	}

	onRowRemoveClick(skillLevel): void {
		this.competitionSetup$.removeSkillLevel(skillLevel);
	}

	ngOnDestroy(): void {
		this.compSetupServiceUnsub.unsubscribe();
	}

}
