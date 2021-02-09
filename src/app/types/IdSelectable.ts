export type DataKey = string | number;

export interface IdSelectable {
	id: DataKey
};

export interface NameDisplayable {
	name: string,
};

export interface TouchedTimestamp {
	lastUpdated: Date,
}

export interface DataBasic extends IdSelectable, NameDisplayable {};