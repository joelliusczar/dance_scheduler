import { Injectable } from '@angular/core';
import { Unsubscribable, PartialObserver, BehaviorSubject } from 'rxjs';
import { Competition, CompSubType } 
	from 'src/app/types/data-shape';
import { BrowserDbService, COMPETITION_TABLE_NAME } 
	from '../browser-Db/browser-db.service';
import { getLatest, swap } from '../../shared/utils/arrayHelpers';
import { Direction, ElevatorDir } from 'src/app/types/directions';
import { v4 } from 'uuid';
import { OpQueueService } from '../op-queue/op-queue.service';

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

const compBaseShape : Competition = {
	id: null,
	name: '',
	ageGroups: [],
	multiEventAgeGroups: [],
	categories: [],
	dances: [],
	multiDances: [],
	skillLevels: [],
	multiEventSkillLevels: [],
	dancers: [],
	heats: [],
	judges: [],
	dateOfComp: null,
	deadline: null,
	lastUpdated: null,
	finished: false,
}

@Injectable({
  providedIn: 'root'
})
export class CompetitionSetupService {

	private competitions: Competition[];
	private currentCompetition: Competition;
	private competitions$ = new BehaviorSubject<Competition>({ ...compBaseShape});
	private allCompetitions$ = new BehaviorSubject<Competition[]>([]);

	constructor(private browserDb: BrowserDbService, 
		private opQueue: OpQueueService) 
	{ 
	}
	
	async _triggerLoadItems() : Promise<void> {
		if(this.currentCompetition) {
			return;
		}
		if(!this.browserDb.isOpen) {
			await this.browserDb.openDb();
		}
		const values = await this.browserDb.getAllValues(COMPETITION_TABLE_NAME);
		this.competitions = values as Competition[];
		if(this.competitions?.length) {
			//get most recent
			this.currentCompetition = getLatest(this.competitions);
		}
		else {
			this.currentCompetition = { ...compBaseShape, 
				id: v4(),
				lastUpdated: new Date()
			};
		}
		this.competitions$.next(this.currentCompetition);
	}

	subscribe(
		observerOrNext?: PartialObserver<Competition> | 
			((value: Competition) => void) | null,
		error?: ((error: any) => void) | null,
		complete?: (() => void) | null
		): Unsubscribable {
			let unsub;
			if(typeof observerOrNext === 'function') {
				unsub = this.competitions$.subscribe(observerOrNext, error, complete);
			}
			else if(typeof observerOrNext === 'object') {
				unsub = this.competitions$.subscribe(observerOrNext);
			}
			else {
				throw new Error('Invalid argument.');
			}
			this.opQueue.enqueueOp(() => this._triggerLoadItems());
			return unsub;
	}

	arraySubscribe(
		observerOrNext?: PartialObserver<Competition[]> | 
			((value: Competition[]) => void) | null,
		error?: ((error: any) => void) | null,
		complete?: (() => void) | null
		): Unsubscribable {
			let unsub;
			if(typeof observerOrNext === 'function') {
				unsub = this.allCompetitions$.subscribe(observerOrNext, error, complete);
			}
			else if(typeof observerOrNext === 'object') {
				unsub = this.allCompetitions$.subscribe(observerOrNext);
			}
			else {
				throw new Error('Invalid argument.');
			}
			this.opQueue.enqueueOp(() => this._triggerLoadItems());
			return unsub;
	}

	replaceAll<T extends CompSubType>(items: T[], key: CompKeyChoices): void {
		this.currentCompetition[key] = (items as any);
		this.browserDb.putValue(COMPETITION_TABLE_NAME, this.currentCompetition);
		this.competitions$.next({
			...this.currentCompetition,
			[key]: items,
			lastUpdated: new Date()
		});
	}

	addItem<T extends CompSubType, U extends CompSubType>
		(item: T, key: CompKeyChoices): U[]
	{
		if(!this.currentCompetition[key]) {
			this.currentCompetition[key] = [];
		}
		item.order = this.currentCompetition[key].length;
		item.id =  v4();
		this.currentCompetition[key].push(item as any);
		return this.currentCompetition[key] as unknown as U[];
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
		const increment = direction === Direction.Up ? 1 : -1;
		if(swap(this.currentCompetition[key], item.order, item.order + increment)) {
			const swapped = this.currentCompetition[key][item.order];
			swapped.order -= increment;
			item.order += increment;
			this.replaceAll(this.currentCompetition[key] as any, key);
		}
	}

	removeItems<T extends CompSubType>(filter: (t:T) => boolean, 
		key: CompKeyChoices): void 
	{
		const data = this.currentCompetition[key] as any;
		if(data instanceof Array) {
			this.replaceAll(data.filter(filter), key);
		}
	}

	get<T extends CompSubType>(key: CompKeyChoices): T[] {
		if(!this.currentCompetition[key]) {
			return [];
		}
		return this.currentCompetition[key] as unknown as T[];
	}

}
