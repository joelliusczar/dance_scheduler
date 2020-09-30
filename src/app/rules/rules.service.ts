import { Injectable, EventEmitter } from '@angular/core';
import { PartialObserver, Subscribable, Unsubscribable } from 'rxjs'

export type plus = '+'

export interface AgeGroupType {
	name: string,
	fromAge: number,
	toAge: number | plus | '',
};

type NextParam<T> = PartialObserver<T> | ((value: T) => void) | null;

@Injectable({
  providedIn: 'root'
})
export class RulesService implements Subscribable<AgeGroupType[]> {

	ageGroups: AgeGroupType[] = [];
	changeEmitter$: EventEmitter<AgeGroupType[]> = new EventEmitter<AgeGroupType[]>();

	constructor() { }


	subscribe(
    observerOrNext?: NextParam<AgeGroupType[]>,
    error?: ((error: any) => void) | null,
    complete?: (() => void) | null
  ): Unsubscribable {
		return this.changeEmitter$.subscribe(observerOrNext, error, complete);
	}

	ReplaceAgeGroups(groups: AgeGroupType[]): void {
		this.ageGroups = groups;
		this.changeEmitter$.emit(this.ageGroups);
	}
	
	SaveAgeGroup(group: AgeGroupType): void {
		this.ageGroups.push(group);
		this.ReplaceAgeGroups(this.ageGroups);
	}

	RemoveAgeGroup(group: AgeGroupType): void {
		this.ReplaceAgeGroups(this.ageGroups.filter(g => g.name !== group.name));
	}

}
