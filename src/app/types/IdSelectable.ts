export type keyType = string | number;

export interface IdSelectable {
	id: keyType
};

export interface NameDisplayable {
	name: string,
};

export interface DataBasic extends IdSelectable, NameDisplayable {};