import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Unsubscribable } from 'rxjs';
import { CompetitionSetupService } 
	from 'src/app/services/competition-setup/competition-setup.service';
import { first } from 'src/app/shared/utils/arrayHelpers';
import { Category, Competition, Dance, DanceDto } from 'src/app/types/data-shape';
import { DirectionEventArg } from '../../types/directions';


@Component({
  selector: 'dance-form',
  templateUrl: './dance-form.component.html',
  styleUrls: ['./dance-form.component.sass']
})
export class DanceFormComponent implements OnInit {

	compSetupServiceUnsub: Unsubscribable;
	dances: DanceDto[] = [];
	linkedDances: Dance[] = [];
	categories: Category[] = [];

	constructor(private competitionSetup$: CompetitionSetupService) 
	{ }

  ngOnInit(): void {
		this.compSetupServiceUnsub = this.competitionSetup$.subscribe(
			(value: Competition) => {
				const danceMap = new Map(value.dances.map(d => [d.id, d]));
				this.dances = value.dances.map(d => ({
					...d,
					linkedDances: d.linkedDanceIds.map(k => danceMap.get(k))
				}));
				this.categories = value.categories;
				this.linkedDances = value.dances;
			}
		);
	}

	reorderClick(eventArg: DirectionEventArg<Dance>): void {
		this.competitionSetup$.moveDance(eventArg.item, eventArg.direction);
	}

	onSubmit(formGroup: FormGroup): void {
		console.log('submit');
		console.log(formGroup);

		if(!formGroup.valid){
			formGroup.markAllAsTouched();
		}
		else {
			const formVal = formGroup.value;
			const linkedIds = formVal.linkedDances?.map(d => d.key) || [];
			this.competitionSetup$.saveDance({
				name: formVal.name,
				shortName: formVal.shortName,
				category: first(formVal.category),
				order: null,
				id: null,
				linkedDanceIds: linkedIds,
			});
			formGroup.reset({}, {emitEvent: false});
		}
	}

	onRowRemoveClick(dance) {
		this.competitionSetup$.removeDance(dance);
	}

	ngOnDestroy(): void {
		this.compSetupServiceUnsub.unsubscribe();
	}
}

