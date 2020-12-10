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
	linkedDances: OptionInfo<Dance>[] = [];
	categories: OptionInfo<Category>[] = [];

	constructor(private competitionSetup$: CompetitionSetupService) 
	{ }

  ngOnInit(): void {
		this.dancesUnsub = this.competitionSetup$.subscribeDances(
			(value: Dance[]) => {
				console.log(value);
				this.dances = value;
				this.linkedDances = value?.map(d => ({ 
					display: d.name, 
					associatedObject: d })
				);
		});
		this.categoriesUnsub = this.competitionSetup$.subscribeCategories(
			(value: Category[]) => {
				this.categories = value?.map(c => ({
					display: c.name,
					associatedObject: c })
				);
			}
		);
	}

	reorderClick(eventArg: DirectionEventArg<Dance>): void {
		this.competitionSetup$.moveDance(eventArg.item, eventArg.direction);
	}

	onSubmit(formGroup: FormGroup): void {
		console.log(formGroup.value);
		if(!formGroup.valid){
			formGroup.markAllAsTouched();
		}
		else {
			// this.competitionSetup$.SaveDance({
			// 	...formGroup.value
			// });
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

