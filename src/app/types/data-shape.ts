import { Sortable } from './sortable';
import { IdSelectable, keyType as KeyType, DataBasic, NameDisplayable } from './IdSelectable';

export type plus = '+'

export interface AgeGroupType extends Sortable, DataBasic {
	fromAge: number,
	toAge: number | plus | '',
};

export interface Category extends Sortable, DataBasic {
};

export interface DanceCommon extends Sortable, IdSelectable {
	categoryId: KeyType,
	linkedDanceIds: string[],
}

export interface DanceDtoCommon extends Sortable, IdSelectable {
	category: Category,
	linkedDances: Dance[],
}

export interface Dance extends DanceCommon, NameDisplayable {
	shortName: string,
};

export interface DanceDto extends DanceDtoCommon, NameDisplayable {
	shortName: string,
}

export interface MultiDance extends DanceCommon {}

export interface MultiDanceDto extends DanceDtoCommon {}

export interface SkillLevel extends Sortable, DataBasic {
}

export interface CoupledDance {
	skillLevel: SkillLevel,
	dance: DanceCommon,
};

export interface School extends DataBasic {
	location: string,
}

export interface PersonBase extends IdSelectable {
	firstName: string,
	lastName: string,
}

export interface Person extends PersonBase {
	schoolId: KeyType,
}

export interface PersonDto extends PersonBase {
	school: School,
}

export interface Couple {
	danceCounts: Map<CoupledDance, number>,
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
	multiEventAgeGroups: AgeGroupType[],
	categories: Category[],
	dances: Dance[],
	multiDances: MultiDance[],
	skillLevels: SkillLevel[],
	multiEventSkillLevels: SkillLevel[],
	dancers: Dancer[],
	heats: Heat[],
	judges: Person[],
	dateOfComp: Date,
	lastUpdated: Date,
	finished: boolean,
};


export type TableTypes = Competition | Person | School;

export type CompSubType = AgeGroupType | Category | Dance | 
	SkillLevel | MultiDance;