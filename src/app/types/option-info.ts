import { IdSelectable } from './id-selectable';

export interface OptionInfo<T = unknown>  extends IdSelectable {
	associatedObject?: T,
	display: string,
};