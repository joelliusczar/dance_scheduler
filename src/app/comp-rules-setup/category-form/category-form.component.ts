import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Unsubscribable } from 'rxjs';
import { CompetitionSetupService, CompKeys } 
	from 'src/app/services/competition-setup/competition-setup.service';
import { Category, Competition, Dance } from 'src/app/types/data-shape';
import { DirectionEventArg } from '../../types/directions';


@Component({
  selector: 'category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.sass']
})
export class CategoryFormComponent implements OnInit {

	compSetupServiceUnsub: Unsubscribable;
	categories: Category[];
	dances: Dance[];
	

  constructor(private competitionSetup$: CompetitionSetupService) { 
		this.categories = [];
	}

  ngOnInit(): void {
		this.compSetupServiceUnsub = this.competitionSetup$.subscribe(
			(value: Competition) => {
				this.categories = value.categories;
				this.dances = value.dances;
			}
		);
	}

	reorderClick(eventArg: DirectionEventArg<Category>): void {
		this.competitionSetup$
			.moveItem(eventArg.item, eventArg.direction, CompKeys.categories);
	}

	onSubmit(formGroup: FormGroup): void {
		if(!formGroup.valid){
			formGroup.markAllAsTouched();
		}
		else {
			this.competitionSetup$.saveItem({
				...formGroup.value
			}, CompKeys.categories);
			formGroup.reset({}, {emitEvent: false});
		}
	}

	onRowRemoveClick(category) {
		const hasDependants = this.dances
	 		.some(d => d.category.id === category.id);
	 	if(hasDependants) {
			const problemDances = this.dances
				.filter(d => d.category.id === category.id)
				.map(d => d.name);
			const problemDancesStr = problemDances.join(',');
			const mainMsg = 'Category could not be removed because ' +
				'the following dances are part of it:';
			alert(`${mainMsg} ${problemDancesStr}`);
			return;
		}
		this.competitionSetup$
				.removeItems(i => i.id !== category.id, CompKeys.categories);
			
	}

	ngOnDestroy(): void {
		this.compSetupServiceUnsub.unsubscribe();
	}
}
