import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Unsubscribable } from 'rxjs';
import { CompetitionSetupService } 
	from 'src/app/services/competition-setup/competition-setup.service';
import { Category, Dance } from 'src/app/types/data-shape';
import { OptionInfo } from 'src/app/types/option-info';
import { DirectionEventArg } from '../../types/directions';


@Component({
  selector: 'dance-form',
  templateUrl: './dance-form.component.html',
  styleUrls: ['./dance-form.component.sass']
})
export class DanceFormComponent implements OnInit {

	dancesUnsub: Promise<Unsubscribable>;
	categoriesUnsub: Promise<Unsubscribable>;
	dances: Dance[] = [];
	categories: Category[] = [];
	tags: OptionInfo[];

	constructor(private competitionSetup$: CompetitionSetupService) 
	{ }

  ngOnInit(): void {
		this.dancesUnsub = this.competitionSetup$.subscribeDances(
			(value: Dance[]) => {
				this.dances = value;
				this.tags = value?.map(d => ({display: d.name}));
		});
		this.categoriesUnsub = this.competitionSetup$.subscribeCategories(
			(value: Category[]) => {
				this.categories = value;
			}
		);
	}

	reorderClick(eventArg: DirectionEventArg<Dance>): void {
		this.competitionSetup$.moveDance(eventArg.item, eventArg.direction);
	}

	onSubmit(formGroup: FormGroup): void {
		if(!formGroup.valid){
			formGroup.markAllAsTouched();
		}
		else {
			this.competitionSetup$.SaveDance({
				...formGroup.value
			});
			formGroup.reset({}, {emitEvent: false});
		}
	}

	onRowRemoveClick(dance) {
		this.competitionSetup$.removeDance(dance);
	}

	ngOnDestroy(): void {
		this.dancesUnsub.then((unsub: Unsubscribable) => {
			unsub.unsubscribe();
		});
		this.categoriesUnsub.then((unsub: Unsubscribable) => {
			unsub.unsubscribe();
		});
	}
}

