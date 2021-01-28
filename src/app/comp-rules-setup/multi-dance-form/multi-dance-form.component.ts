import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Unsubscribable } from 'rxjs';
import { CompetitionSetupService, CompKeys } from 'src/app/services/competition-setup/competition-setup.service';
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
	dancesChoices: Dance[] = [];
	dances: MultiDanceDto[] = [];

	@ViewChild('firstInput') firstInput: ElementRef;

  constructor(private competitionSetup$: CompetitionSetupService) { }

  ngOnInit(): void {
		this.compSetupServiceUnsub = this.competitionSetup$.subscribe(
			(value: Competition) => {
				const danceMap = new Map(value.dances.map(d => [d.id, d]));
				this.dances = value.multiDances.map(d => ({
					...d,
					linkedDances: d.linkedDanceIds.map(k => danceMap.get(k))
				}));
				this.categories = value.categories;
				this.dancesChoices = value.dances;
			}
		);
	}

	reorderClick(eventArg: DirectionEventArg<MultiDance>): void {
		this.competitionSetup$
			.moveItem(eventArg.item, eventArg.direction, CompKeys.multiDances);
	}

	onRowRemoveClick(dance: MultiDanceDto) {
	}
	
	onSubmit(formGroup: FormGroup): void {
		if(!formGroup.valid){
			formGroup.markAllAsTouched();
		}
		else {
			const formVal = formGroup.value;

			formGroup.reset({}, {emitEvent: false});
			(this.firstInput.nativeElement as HTMLElement).focus();
		}
	}

}
