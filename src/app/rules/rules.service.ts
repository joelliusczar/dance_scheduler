import { Injectable } from '@angular/core';

export type plus = '+'

export interface AgeGroupType {
	name: string,
	fromAge: number,
	toAge: number | plus | '',
};

@Injectable({
  providedIn: 'root'
})
export class RulesService {

	ageGroups: Array<AgeGroupType> = [];

	constructor() { }
	
	SaveAgeGroup(group: AgeGroupType): void {
		this.ageGroups.push(group);
	}
}
