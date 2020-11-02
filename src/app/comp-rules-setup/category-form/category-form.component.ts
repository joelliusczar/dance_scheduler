import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Unsubscribable } from 'rxjs';
import { CompetitionSetupService } 
	from 'src/app/services/competition-setup/competition-setup.service';
import { Category } from 'src/app/types/data-shape';
import { DirectionEventArg } from '../../types/directions';


@Component({
  selector: 'category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.sass']
})
export class CategoryFormComponent implements OnInit {

	compSetupServiceUnsub: Promise<Unsubscribable>;
	categories: Category[];
	

  constructor(private competitionSetup$: CompetitionSetupService) { 
		this.categories = [];
	}

  ngOnInit(): void {
		this.compSetupServiceUnsub = this.competitionSetup$.subscribeCategories(
			(value: Category[]) => {
				this.categories = value;
		});
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
		this.competitionSetup$.removeCategory(category);
	}

	ngOnDestroy(): void {
		this.compSetupServiceUnsub.then((unsub: Unsubscribable) => {
			unsub.unsubscribe();
		});
	}
}
