import { Sortable } from './sortable';
import { IdSelectable, keyType, DataBasic } from './IdSelectable';

export type plus = '+'

export interface AgeGroupType extends Sortable, DataBasic {
	fromAge: number,
	toAge: number | plus | '',
};

export interface Category extends Sortable, DataBasic {
};

export interface Dance extends Sortable, DataBasic {
	shortName: string,
	category: Category,
	linkedDanceIds: number[],
};

export interface DanceDto extends Sortable, DataBasic {
	shortName: string,
	category: Category,
	linkedDances: Dance[],
}

export interface SkillLevel extends Sortable, DataBasic {
}

export interface GroupedDance extends Dance {
	skillLevel: SkillLevel,
};

export interface School extends DataBasic {
	location: string,
}

export interface PersonBase extends IdSelectable {
	firstName: string,
	lastName: string,
}

export interface Person extends PersonBase {
	schoolId: keyType,
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


export interface Competition extends DataBasic {
	ageGroups: AgeGroupType[],
	categories: Category[],
	dances: Dance[],
	skillLevels: SkillLevel[],
	dancers: Dancer[],
	heats: Heat[],
	judges: Person[],
	dateOfComp: Date,
	lastUpdated: Date,
	finished: boolean,
};


export type TableTypes = Competition | Person | School;