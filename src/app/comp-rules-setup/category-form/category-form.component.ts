import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Unsubscribable } from 'rxjs';
import { CompetitionSetupService } 
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
		this.competitionSetup$.moveCategory(eventArg.item, eventArg.direction);
	}

	onSubmit(formGroup: FormGroup): void {
		if(!formGroup.valid){
			formGroup.markAllAsTouched();
		}
		else {
			this.competitionSetup$.SaveCategory({
				...formGroup.value
			});
			formGroup.reset({}, {emitEvent: false});
		}
	}

	onRowRemoveClick(category) {
		if(!this.competitionSetup$.removeCategory(category)) {
			const problemDances = this.dances
				.filter(d => d.category.key === category.key)
				.map(d => d.name);
			const problemDancesStr = problemDances.join(',');
			const mainMsg = 'Category could not be removed because ' +
				'the following dances are part of it:';
			alert(`${mainMsg} ${problemDancesStr}`);
		}
	}

	ngOnDestroy(): void {
		this.compSetupServiceUnsub.unsubscribe();
	}
}
