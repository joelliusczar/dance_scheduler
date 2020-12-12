import { Sortable } from './sortable';
import { IdSelectable, NumericKeySelectable } from './IdSelectable';

export type plus = '+'

export interface AgeGroupType extends Sortable, NumericKeySelectable {
	name: string,
	fromAge: number,
	toAge: number | plus | '',
};

export interface Category extends Sortable, NumericKeySelectable {
	name: string,
};

export interface Dance extends Sortable, NumericKeySelectable {
	name: string,
	category: Category,
	linkedDanceIds: number[],
};

export interface SkillLevel extends Sortable {
	name: string,
}

export interface GroupedDance extends Dance {
	skillLevel: SkillLevel,
};

export interface School extends IdSelectable {
	name: string,
	location: string,
}

export interface PersonBase extends IdSelectable {
	firstName: string,
	lastName: string,
}

export interface Person extends PersonBase {
	schoolId: string,
}

export interface PersonDto extends PersonBase {
	school: School,
}

export interface Couple {
	danceCounts: Map<GroupedDance, number>,
	dancers: [Dancer, Dancer],
};

export interface Dancer extends Person {
	couples: Couple[],
};

export interface Heat {
	num: number,
	dance: Dance,
	couples: Couple[],
	impossible: Set<Couple>,
};


export interface Competition extends IdSelectable {
	name: string,
	ageGroups: AgeGroupType[],
	categories: Category[],
	dances: Dance[],
	skillLevels: SkillLevel[],
	dancers: Dancer[],
	heats: Heat[],
	judges: Person[],
	date: Date,
	lastUpdated: Date,
	finished: boolean,
};


export type TableTypes = Competition | Person | School;