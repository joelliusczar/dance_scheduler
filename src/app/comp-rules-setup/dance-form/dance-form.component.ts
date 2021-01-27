import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Unsubscribable } from 'rxjs';
import { CompetitionSetupService, CompKeys } 
	from 'src/app/services/competition-setup/competition-setup.service';
import { first } from 'src/app/shared/utils/arrayHelpers';
import { Category, Competition, Dance, DanceDto } from 'src/app/types/data-shape';
import { keyType } from 'src/app/types/IdSelectable';
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

	@ViewChild('firstInput') firstInput: ElementRef;

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
		this.competitionSetup$
			.moveItem(eventArg.item, eventArg.direction, CompKeys.dances);
	}

	onSubmit(formGroup: FormGroup): void {
		if(!formGroup.valid){
			formGroup.markAllAsTouched();
		}
		else {
			const formVal = formGroup.value;
			const linkedIds = formVal.linkedDances?.map(d => d.id) || [];
			this.saveDance({
				name: formVal.name,
				shortName: formVal.shortName,
				category: first(formVal.category),
				order: null,
				id: null,
				linkedDanceIds: linkedIds,
			});
			formGroup.reset({}, {emitEvent: false});
			(this.firstInput.nativeElement as HTMLElement).focus();
		}
	}

	saveDance(dance: Dance): void {
		const dances = this.competitionSetup$
			.addItem(dance, CompKeys.dances) as Dance[];
		if(dance.linkedDanceIds?.length > 0) {
			const updated = dances.map(d => {
				if(dance.linkedDanceIds.some(k => k === d.id)) {
					return {...d, linkedDanceIds: [...(d.linkedDanceIds || []), dance.id]};
				}
				return d;
			});
			this.competitionSetup$.replaceAll(updated, CompKeys.dances);
			return;
		}
		this.competitionSetup$.replaceAll(dances, CompKeys.dances);
	}

	onRowRemoveClick(dance) {
		this.removeDance(dance);
	}

	removeDance(dance: Dance): void {
		const dances: Dance[] = this.competitionSetup$.get(CompKeys.dances);
		const filtered = dances
			.filter(i => i.id != dance.id);
		if(dance.linkedDanceIds?.length > 0) {
			const keySet = new Set<keyType>(dance.linkedDanceIds);
			const filteredModified = filtered.map(d => {
				if(keySet.has(d.id)) {
					return { ...d, 
						linkedDanceIds: d.linkedDanceIds.filter(k => k !== dance.id)
					};
				}
				return d;
			});
			this.competitionSetup$.replaceAll(filteredModified, CompKeys.dances);
			return;
		}
		this.competitionSetup$.replaceAll(filtered, CompKeys.dances);
	}

	ngOnDestroy(): void {
		this.compSetupServiceUnsub.unsubscribe();
	}
}

