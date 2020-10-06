import { Injectable, EventEmitter } from '@angular/core';
import { PartialObserver, Subscribable, Unsubscribable } from 'rxjs'
import { Direction, ElevatorDir } from '../types/directions';
import { swap } from '../shared/utils/arrayHelpers';
import { Sortable } from '../types/sortable';

export type plus = '+'

export interface AgeGroupType extends Sortable {
	name: string,
	fromAge: number,
	toAge: number | plus | '',
};

export interface Category extends Sortable {
	name: string,
};

export interface Dance extends Sortable {
	name: string,
	category: Category
};

export function OrderCompare(a: Sortable, b: Sortable): number {
	return a.order - b.order;
}

export class VariantService<T extends Sortable> implements Subscribable<T[]>{

	items: T[] = [];
	items$: EventEmitter<T[]> = new EventEmitter<T[]>();

	constructor() { }


	subscribe(
    observerOrNext?: PartialObserver<T[]> | ((value: T[]) => void) | null,
    error?: ((error: any) => void) | null,
    complete?: (() => void) | null
  ): Unsubscribable {
		return this.items$.subscribe(observerOrNext, error, complete);
	}

	ReplaceAll(items: T[]): void {
		this.items = items;
		this.items$.emit(this.items);
	}
	
	SaveItem(item: T): void {
		item.order = this.items.length;
		this.items.push(item);
		this.ReplaceAll(this.items);
	}


	moveItem(item: T, direction: ElevatorDir): void {
		const increment = direction === Direction.Up ? 1 : -1;
		if(swap(this.items, item.order, item.order + increment)) {
			const swapped = this.items[item.order];
			swapped.order -= increment;
			item.order += increment;
			this.ReplaceAll(this.items);
		}
	}

	RemoveItem(item: T): void {
		throw new Error(`Not implemented. ${item} was not removed.`);
	}

}

@Injectable({
  providedIn: 'root'
})
export class AgeGroupService extends VariantService<AgeGroupType> {

	RemoveItem(item: AgeGroupType): void {
		this.ReplaceAll(this.items.filter(i => i.name != item.name));
	}
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService extends VariantService<Category> {

	RemoveItem(item: Category): void {
		this.ReplaceAll(this.items.filter(i => i.name != item.name));
	}
}
