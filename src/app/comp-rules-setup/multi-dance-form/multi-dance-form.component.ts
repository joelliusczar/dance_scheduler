import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Unsubscribable } from 'rxjs';
import { CompetitionSetupService, CompKeys } from 'src/app/services/competition-setup/competition-setup.service';
import { first } from 'src/app/shared/utils/arrayHelpers';
import { Category, Competition, Dance, MultiDance, MultiDanceDto } from 'src/app/types/data-shape';
import { DirectionEventArg } from 'src/app/types/directions';

@Component({
  selector: 'app-multi-dance-form',
  templateUrl: './multi-dance-form.component.html',
  styleUrls: ['./multi-dance-form.component.sass']
})
export class MultiDanceFormComponent implements OnInit {

	compSetupServiceUnsub: Unsubscribable;
	categories: Category[] = [];
	danceChoices: Dance[] = [];
	dances: MultiDanceDto[] = [];

	@ViewChild('firstInput') firstInput: ElementRef;

  constructor(private competitionSetup$: CompetitionSetupService) { }

  ngOnInit(): void {
		this.compSetupServiceUnsub = this.competitionSetup$.subscribe(
			(value: Competition) => {
				const danceMap = new Map(value.dances.map(d => [d.id, d]));
				const catMap = new Map(value.categories.map(c => [c.id, c]));
				this.dances = value.multiDances.map(d => ({
					...d,
					category: catMap.get(d.categoryId),
					linkedDances: d.linkedDanceIds.map(k => danceMap.get(k))
				}));
				this.categories = value.categories;
				this.danceChoices = value.dances;
			}
		);
	}

	reorderClick(eventArg: DirectionEventArg<MultiDance>): void {
		this.competitionSetup$
			.moveItem(eventArg.item, eventArg.direction, CompKeys.multiDances);
	}

	onRowRemoveClick(dance: MultiDanceDto) {
		this.competitionSetup$
		 .removeItems(i => i.id !== dance.id, CompKeys.multiDances);
	}
	
	onSubmit(formGroup: FormGroup): void {
		if(!formGroup.valid){
			formGroup.markAllAsTouched();
		}
		else {
			const formVal = formGroup.value;
			this.competitionSetup$.saveItem({
				categoryId: (first(formVal.category) as Category).id,
				linkedDanceIds: formVal.linkedDances.map(d => d.id)
			} as MultiDance, CompKeys.multiDances);
			formGroup.reset({}, {emitEvent: false});
		}
	}

	ngOnDestroy(): void {
		this.compSetupServiceUnsub.unsubscribe();
	}

}
