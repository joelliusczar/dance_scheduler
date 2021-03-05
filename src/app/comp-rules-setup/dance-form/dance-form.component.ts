import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Unsubscribable } from 'rxjs';
import { CompetitionSetupService, CompKeys } 
	from '../../services/competition-setup/competition-setup.service';
import { first } from '../../shared/utils/arrayHelpers';
import { Category, Dance, DanceDto } from '../../types/data-shape';
import { DataKey } from '../../types/data-key';
import { DirectionEventArg } from '../../types/directions';
import { Competition } from 'src/app/types/competition';


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
	multiDanceDanceIds: Set<DataKey> = new Set();

	@ViewChild('firstInput') firstInput: ElementRef;

	constructor(private competitionSetup$: CompetitionSetupService) 
	{ }

  ngOnInit(): void {
		this.compSetupServiceUnsub = this.competitionSetup$.subscribe(
			(value: Competition) => {
				const danceMap = new Map(value.dances.map(d => [d.id, d]));
				const catMap = new Map(value.categories.map(c => [c.id, c]));
				this.dances = value.dances.map(d => ({
					...d,
					category: catMap.get(d.categoryId),
					linkedDances: d.linkedDanceIds.map(k => danceMap.get(k))
				}));
				this.categories = value.categories;
				this.linkedDances = value.dances;
				value.multiDances.flatMap(md => md.linkedDanceIds)
					.forEach(id => this.multiDanceDanceIds.add(id as DataKey));
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
				categoryId: (first(formVal.category) as Category).id,
				order: null,
				id: null,
				linkedDanceIds: linkedIds,
			});
			formGroup.reset({}, {emitEvent: false});
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

	onRowRemoveClick(dance: DanceDto) {
		const hasDependants = this.multiDanceDanceIds.has(dance.id as DataKey);
		if(hasDependants) {
			alert('Dance could not be removed because some multi dances are using it');
			return;
		}
		else {
			this.removeDance(dance);
		}
	}

	removeDance(dance: DanceDto): void {
		const dances: Dance[] = this.competitionSetup$.get(CompKeys.dances);
		const filtered = dances
			.filter(i => i.id != dance.id);
		if(dance.linkedDances?.length > 0) {
			const keySet = new Set<DataKey>(dance.linkedDances.map(d => d.id));
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

