import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject, Unsubscribable } from 'rxjs';
import { DanceVariantService, CategoryService, Dance, Category } from '../../rules/variant.service';
import { DirectionEventArg } from '../../types/directions';


@Component({
  selector: 'dance-form',
  templateUrl: './dance-form.component.html',
  styleUrls: ['./dance-form.component.sass']
})
export class DanceFormComponent implements OnInit {

	variantServiceUnsub: Unsubscribable;
	categoryServiceUnsub: Unsubscribable;
	dances: Dance[] = [];
	categories: Category[] = [];
	

	constructor(private variantService$: DanceVariantService, 
		private categoryService$: CategoryService) 
	{ }

  ngOnInit(): void {
		this.variantServiceUnsub = this.variantService$.subscribe(
			(value: Dance[]) => {
				this.dances = value;
		});
		this.categoryServiceUnsub = this.categoryService$.subscribe(
			(value: Category[]) => {
				this.categories = value;
			}
		);
	}

	reorderClick(eventArg: DirectionEventArg<Dance>): void {
		this.variantService$.moveItem(eventArg.item, eventArg.direction);
	}

	onSubmit(formGroup: FormGroup): void {
		if(!formGroup.valid){
			formGroup.markAllAsTouched();
		}
		else {
			this.variantService$.SaveItem({
				...formGroup.value
			});
			formGroup.reset({}, {emitEvent: false});
		}
	}

	onRowRemoveClick(dance) {
		this.variantService$.RemoveItem(dance);
	}

	ngOnDestroy(): void {
		this.variantServiceUnsub.unsubscribe();
		this.categoryServiceUnsub.unsubscribe();
	}
}

