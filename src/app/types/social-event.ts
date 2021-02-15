import { DataBasic } from './data-basic';
import { TouchedTimestamp } from './touch-timestamp';

export interface SocialEvent extends DataBasic, TouchedTimestamp{
	eventDate: Date;
}