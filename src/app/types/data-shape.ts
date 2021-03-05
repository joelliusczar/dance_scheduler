import { Sortable } from './sortable';
import { DataKey } from './data-key';
import { IdSelectable } from './id-selectable';
import { NameDisplayable } from './name-displayable';
import { DataBasic } from './data-basic';
import { SocialEvent } from './social-event';

export type plus = '+'

export interface AgeGroupType extends Sortable, DataBasic {
	fromAge: number,
	toAge: number | plus | '',
};

export interface Category extends Sortable, DataBasic {
};

export interface DanceCommon extends Sortable, IdSelectable {
	categoryId: DataKey,
	linkedDanceIds: DataKey[],
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
	schoolId: DataKey,
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


export type CompSubType = AgeGroupType | Category | Dance | 
	SkillLevel | MultiDance;