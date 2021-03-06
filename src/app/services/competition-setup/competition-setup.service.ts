import { Injectable } from '@angular/core';
import { Unsubscribable, PartialObserver, BehaviorSubject, Subject } from 'rxjs';
import { CompSubType } 
	from '../../types/data-shape';
import { BrowserDbService, COMPETITION_TABLE_NAME } 
	from '../browser-Db/browser-db.service';
import { getLatestIdx, immutableReplace, swap } from '../../shared/utils/arrayHelpers';
import { Direction, ElevatorDir } from '../../types/directions';
import { v4 } from 'uuid';
import { OpQueueService } from '../op-queue/op-queue.service';
import { DEFAULT_COMPETITION, EMPTY_COMPETITION } from '../../types/constants';
import { DataKey } from '../../types/data-key';
import { Competition } from 'src/app/types/competition';


export enum CompKeys {
	ageGroups = 'ageGroups',
	categories = 'categories',
	dances = 'dances',
	multiDances = 'multiDances',
	skillLevels = 'skillLevels',
	multiEventAgeGroups = 'multiEventAgeGroups',
	multiEventSkillLevels = 'multiEventSkillLevels',
}

export type CompKeyChoices = keyof typeof CompKeys;


@Injectable({
  providedIn: 'root'
})
export class CompetitionSetupService {

	private competitions: Competition[];
	private currentCompetitionIdx = -1;
	private competitions$ = new BehaviorSubject<Competition>(new Competition());
	private allCompetitions$ = new BehaviorSubject<Competition[]>([]);

	constructor(private browserDb: BrowserDbService, 
		private opQueue: OpQueueService) 
	{ 
	}

	
	async _triggerLoadItems() : Promise<void> {
		if(this.currentCompetitionIdx > -1 && this.browserDb.isOpen) {
			return;
		}
		if(!this.browserDb.isOpen) {
			await this.browserDb.openDb();
		}
		const values = await this.browserDb.getAllValues(COMPETITION_TABLE_NAME);
		this.competitions = values as Competition[];
		if(this.competitions?.length) {
			//get most recent
			this.currentCompetitionIdx = getLatestIdx(this.competitions);
		}
		else {
			this.currentCompetitionIdx = 0;
			this.competitions = [ new Competition() ];
		}
		this.competitions$.next(this.competitions[this.currentCompetitionIdx]);
		this.allCompetitions$.next(this.competitions);
	}

	private _subscribeCommon<T>(subject$: Subject<T>, 
		observerOrNext?: PartialObserver<T> | 
		((value: T) => void) | null,
		error?: ((error: any) => void) | null,
		complete?: (() => void) | null): Unsubscribable 
	{
		let unsub;
		if(typeof observerOrNext === 'function') {
			unsub = subject$.subscribe(observerOrNext, error, complete);
		}
		else if(typeof observerOrNext === 'object') {
			unsub = subject$.subscribe(observerOrNext);
		}
		else {
			throw new Error('Invalid argument.');
		}
		this.opQueue.enqueueOp(() => this._triggerLoadItems());
		return unsub;
	}
	

	subscribe(
		observerOrNext?: PartialObserver<Competition> | 
			((value: Competition) => void) | null,
		error?: ((error: any) => void) | null,
		complete?: (() => void) | null
		): Unsubscribable 
	{
		return this._subscribeCommon(this.competitions$, 
			observerOrNext, error, complete);
	}

	arraySubscribe(
		observerOrNext?: PartialObserver<Competition[]> | 
			((value: Competition[]) => void) | null,
		error?: ((error: any) => void) | null,
		complete?: (() => void) | null
		): Unsubscribable {
			return this._subscribeCommon(this.allCompetitions$, 
				observerOrNext, error, complete);
	}

	replaceAll<T extends CompSubType>(items: T[], key: CompKeyChoices): void {
		const currentCompetition = new Competition(
			this.competitions[this.currentCompetitionIdx]);
		currentCompetition[key] = items as any;
		this.browserDb.putValue(COMPETITION_TABLE_NAME, currentCompetition);
		this.competitions$.next(currentCompetition);
		this.competitions = immutableReplace(this.competitions, 
			currentCompetition, 
			this.currentCompetitionIdx);
		this.allCompetitions$.next(this.competitions);
	}

	addItem<T extends CompSubType, U extends CompSubType>
		(item: T, key: CompKeyChoices): U[]
	{
		const currentCompetition = this.competitions[this.currentCompetitionIdx];
		const items = [...currentCompetition[key]] || [];
		item.order = items.length;
		item.id =  v4();
		items.push(item as any);
		return items as unknown as U[];
	}

	saveItem<T extends CompSubType>
		(item: T, key: CompKeyChoices): void 
	{
		const expandedList = this.addItem(item, key);
		this.replaceAll(expandedList, key);
	}

	moveItem<T extends CompSubType>(item: T, direction: ElevatorDir, 
		key: CompKeyChoices): void 
	{
		const currentCompetition = this.competitions[this.currentCompetitionIdx];
		const items = [...currentCompetition[key]];
		const increment = direction === Direction.Up ? 1 : -1;
		if(swap(items, item.order, item.order + increment)) {
			const swapped = items[item.order];
			swapped.order -= increment;
			item.order += increment;
			this.replaceAll(items, key);
		}
	}

	removeItems<T extends CompSubType>(filter: (t:T) => boolean, 
		key: CompKeyChoices): void 
	{
		const currentCompetition = this.competitions[this.currentCompetitionIdx];
		const data = currentCompetition[key] as any;
		if(data instanceof Array) {
			this.replaceAll(data.filter(filter), key);
		}
	}

	async get<T extends CompSubType>(key: CompKeyChoices): Promise<T[]> {
		await this._triggerLoadItems();
		const currentCompetition = this.competitions[this.currentCompetitionIdx];
		if(!currentCompetition[key]) {
			return [];
		}
		return currentCompetition[key] as unknown as T[];
	}


}
