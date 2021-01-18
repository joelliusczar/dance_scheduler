import { IdSelectable } from './IdSelectable';

export interface OptionInfo<T = unknown>  extends IdSelectable {
	associatedObject?: T,
	display: string,
};