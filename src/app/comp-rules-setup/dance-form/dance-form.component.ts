import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Unsubscribable } from 'rxjs';
import { CompetitionSetupService } 
	from 'src/app/services/competition-setup/competition-setup.service';
import { first } from 'src/app/shared/utils/anyHelper';
import { Category, Competition, Dance } from 'src/app/types/data-shape';
import { OptionInfo } from 'src/app/types/option-info';
import { DirectionEventArg } from '../../types/directions';


@Component({
  selector: 'dance-form',
  templateUrl: './dance-form.component.html',
  styleUrls: ['./dance-form.component.sass']
})
export class DanceFormComponent implements OnInit {

	compSetupServiceUnsub: Unsubscribable;
	dances: Dance[] = [];
	linkedDances: OptionInfo<Dance>[] = [];
	categories: OptionInfo<Category>[] = [];

	constructor(private competitionSetup$: CompetitionSetupService) 
	{ }

  ngOnInit(): void {
		this.compSetupServiceUnsub = this.competitionSetup$.subscribe(
			(value: Competition) => {
				this.dances = value.dances;
				this.categories = value?.categories?.map((c) => ({
					display: c.name,
					associatedObject: c,
					key: c.key
				}));
				this.linkedDances = value?.dances?.map((d) => ({ 
					display: d.name, 
					associatedObject: d,
					key: d.key,
				}));
			}
		);
	}

	reorderClick(eventArg: DirectionEventArg<Dance>): void {
		this.competitionSetup$.moveDance(eventArg.item, eventArg.direction);
	}

	onSubmit(formGroup: FormGroup): void {
		console.log('submit');
		console.log(formGroup.value);
		if(!formGroup.valid){
			formGroup.markAllAsTouched();
		}
		else {
			const formVal = formGroup.value;
			const category = first(formVal.category) as OptionInfo<Category>;
			this.competitionSetup$.SaveDance({
				name: formVal.name,
				category: category?.associatedObject,
				order: null,
				key: null,
				linkedDanceIds: [],
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

