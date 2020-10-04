import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Unsubscribable } from 'rxjs';
import { CategoryService, Category } from '../../rules/variant.service';


@Component({
  selector: 'category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.sass']
})
export class CategoryFormComponent implements OnInit {

	ruleServiceUnsub: Unsubscribable;
	categories: Array<Category>;
	

  constructor(private variantService$: CategoryService) { 
		this.categories = [];
	}

  ngOnInit(): void {
		this.ruleServiceUnsub = this.variantService$.subscribe(
			(value: Category[]) => {
				this.categories = value;
		});
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

	onRowRemoveClick(category) {
		this.variantService$.RemoveItem(category);
	}

	ngOnDestroy(): void {
		this.ruleServiceUnsub.unsubscribe();
	}
}
