import { DataKey } from './data-key';
import { IdSelectable } from './id-selectable';
import { NameDisplayable } from './name-displayable';

export interface DataBasic extends IdSelectable, NameDisplayable {};

//this is needed for stupid storybook, typescript reasons
//exporting a const with the same name as our interface
export const DataBasic = 'DataBasic'; 