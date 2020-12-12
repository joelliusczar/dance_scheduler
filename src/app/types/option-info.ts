import { NumericKeySelectable } from './IdSelectable';

export interface OptionInfo<T = unknown>  extends NumericKeySelectable {
	associatedObject?: T,
	display: string,
};