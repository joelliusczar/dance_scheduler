export type KeyType = string | number;

export interface IdSelectable {
	id: KeyType
};

export interface NameDisplayable {
	name: string,
};

export interface TouchedTimestamp {
	lastUpdated: Date,
}

export interface DataBasic extends IdSelectable, NameDisplayable {};