import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Unsubscribable } from 'rxjs';
import { CompetitionSetupService, CompKeys } from 'src/app/services/competition-setup/competition-setup.service';
import { Competition, SkillLevel } from 'src/app/types/data-shape';
import { DirectionEventArg } from 'src/app/types/directions';

export type SkillLevelsChoice = CompKeys.skillLevels | CompKeys.multiEventSkillLevels;

@Component({
  selector: 'app-skill-level-form',
  templateUrl: './skill-level-form.component.html',
  styleUrls: ['./skill-level-form.component.sass']
})
export class SkillLevelFormComponent implements OnInit {

	@Input('skillLevelsChoice') skillLevelsChoice: SkillLevelsChoice = CompKeys.skillLevels;
	compSetupServiceUnsub: Unsubscribable;
	skillLevels: SkillLevel[] = [];

	@ViewChild('firstInput') firstInput: ElementRef;

	constructor(private competitionSetup$: CompetitionSetupService) 
	{ }

  ngOnInit(): void {
		this.compSetupServiceUnsub = this.competitionSetup$.subscribe(
			(value: Competition) => {
				this.skillLevels = value[this.skillLevelsChoice];
			}
		);
	}

	reorderClick(eventArg: DirectionEventArg<SkillLevel>): void {
		this.competitionSetup$
			.moveItem(eventArg.item, eventArg.direction, this.skillLevelsChoice);
	}

	onSubmit(formGroup: FormGroup): void {

		if(!formGroup.valid){
			formGroup.markAllAsTouched();
		}
		else {
			const formVal = formGroup.value;
			this.competitionSetup$.saveItem({
				...formVal,
				order: null,
				key: null,
			}, this.skillLevelsChoice);
			formGroup.reset({}, {emitEvent: false});
			(this.firstInput.nativeElement as HTMLElement).focus();
		}
	}

	onRowRemoveClick(skillLevel): void {
		this.competitionSetup$
			.removeItems(i => i.id !== skillLevel.id, this.skillLevelsChoice);
	}

	ngOnDestroy(): void {
		this.compSetupServiceUnsub.unsubscribe();
	}

}
