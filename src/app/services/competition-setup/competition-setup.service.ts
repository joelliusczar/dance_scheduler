import { Injectable } from '@angular/core';
import { Unsubscribable, Subject, PartialObserver } from 'rxjs';
import { AgeGroupType, Category, Dance, Competition, SkillLevel } 
	from 'src/app/types/data-shape';
import { Sortable } from 'src/app/types/sortable';
import { BrowserDbService, COMPETITION_TABLE_NAME } 
	from '../browser-Db/browser-db.service';
import { swap } from '../../shared/utils/arrayHelpers';
import { Direction, ElevatorDir } from 'src/app/types/directions';
import { v4 } from 'uuid';
import { IdSelectable, keyType } from 'src/app/types/IdSelectable';
import { OpQueueService } from '../op-queue/op-queue.service';

enum CompKeys {
	AgeGroups = 'ageGroups',
	Categories = 'categories',
	Dances = 'dances',
	SkillLevls = 'skillLevels'
}

const compBaseShape : Competition = {
	id: null,
	name: '',
	ageGroups: [],
	categories: [],
	dances: [],
	skillLevels: [],
	dancers: [],
	heats: [],
	judges: [],
	dateOfComp: null,
	lastUpdated: null,
	finished: false,
}

@Injectable({
  providedIn: 'root'
})
export class CompetitionSetupService {

	private competitions: Competition[];
	private currentCompetition: Competition;
	private competitions$ = new Subject<Competition>();

	constructor(private browserDb: BrowserDbService, 
		private opQueue: OpQueueService) 
	{ 
		console.log('comp service');
	}
	
	async _triggerLoadItems() : Promise<void> {
		const note = v4();
		console.log(`_triggerLoadItems ${note}`);
		if(this.currentCompetition) {
			console.log('it exits');
			this.competitions$.next(this.currentCompetition);
			return;
		}
		console.log(`_before dbopen ${note}`);
		if(!this.browserDb.isOpen) {
			await this.browserDb.openDb();
		}
		console.log(`_before pull ${note}`);
		const values = await this.browserDb.getAllValues(COMPETITION_TABLE_NAME);
		this.competitions = values as Competition[];
		if(this.competitions?.length) {
			this.currentCompetition = this.competitions
				.reduce((a, c) => c.lastUpdated > a.lastUpdated ? c : a);
		}
		else {
			this.currentCompetition = { ...compBaseShape, 
				id: v4(),
				lastUpdated: new Date()
			};
		}
		console.log(`_before next ${note}`);
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

	private replaceAll<T>(items: T[], key: string): void {
		this.currentCompetition[key] = items;
		this.browserDb.putValue(COMPETITION_TABLE_NAME, this.currentCompetition);
		console.log('next 3');
		this.competitions$.next({
			...this.currentCompetition,
			[key]: items,
			lastUpdated: new Date()
		});
	}

	replaceAllAgeGroups(ageGroups: AgeGroupType[]): void {
		this.replaceAll(ageGroups, CompKeys.AgeGroups);
	}

	replaceAllCategories(categories: Dance[]): void {
		this.replaceAll(categories, CompKeys.Categories);
	}

	replaceAllDances(dances: Dance[]): void {
		this.replaceAll(dances, CompKeys.Dances);
	}

	private addItem<T extends Sortable & IdSelectable>
		(item: T, key: string): void 
	{
		if(!this.currentCompetition[key]) {
			this.currentCompetition[key] = [];
		}
		item.order = this.currentCompetition[key].length;
		item.id =  Date.now();
		
		this.currentCompetition[key].push(item);
	}

	private saveItem<T extends Sortable & IdSelectable>
		(item: T, key: string): void 
	{
		this.addItem(item, key);
		this.replaceAll(this.currentCompetition[key], key);
	}

	saveAgeGroup(ageGroup: AgeGroupType): void {
		this.saveItem(ageGroup, CompKeys.AgeGroups);
	}

	saveCategory(category: Category): void {
		this.saveItem(category, CompKeys.Categories);
	}

	saveDance(dance: Dance): void {
		this.addItem(dance, CompKeys.Dances);
		if(dance.linkedDanceIds?.length > 0) {
			const dances = this.currentCompetition.dances.map(d => {
				if(dance.linkedDanceIds.some(k => k === d.id)) {
					return {...d, linkedDanceIds: [...(d.linkedDanceIds || []), dance.id]};
				}
				return d;
			});
			this.replaceAll(dances, CompKeys.Dances);
			return;
		}
		this.replaceAll(this.currentCompetition.dances, CompKeys.Dances);
	}

	saveSkillLevel(skillLevel: SkillLevel): void {
		this.saveItem(skillLevel, CompKeys.SkillLevls);
	}

	private moveItem<T extends Sortable>(item: T, direction: ElevatorDir, 
		key: string): void 
	{
		const increment = direction === Direction.Up ? 1 : -1;
		if(swap(this.currentCompetition[key], item.order, item.order + increment)) {
			const swapped = this.currentCompetition[key][item.order];
			swapped.order -= increment;
			item.order += increment;
			this.replaceAll(this.currentCompetition[key], key);
		}
	}

	moveAgeGroup(ageGroup: AgeGroupType, direction: ElevatorDir): void {
		this.moveItem(ageGroup, direction, CompKeys.AgeGroups);
	}

	moveCategory(category: Category, direction: ElevatorDir): void {
		this.moveItem(category, direction, CompKeys.Categories);
	}

	moveDance(dance: Dance, direction: ElevatorDir): void {
		this.moveItem(dance, direction, CompKeys.Dances);
	}

	moveSkillLevel(skillLevel: SkillLevel, direction: ElevatorDir): void {
		this.moveItem(skillLevel, direction, CompKeys.SkillLevls);
	}

	removeAgeGroup(ageGroup: AgeGroupType): void {
		if(!this.currentCompetition.ageGroups) return;
		this.replaceAll(this.currentCompetition.ageGroups
			.filter(i => i.id !== ageGroup.id), 
			CompKeys.AgeGroups);
	}

	removeCategory(category: Category): boolean {
		if(!this.currentCompetition.categories) return false;
		const hasDependants = this.currentCompetition.dances
			.some(d => d.category.id === category.id);
		if(hasDependants) return false;
		this.replaceAll(this.currentCompetition.categories
			.filter(i => i.id !== category.id), 
			CompKeys.Categories);
		return true;
	}

	removeDance(dance: Dance): void {
		if(!this.currentCompetition.dances) return;
		const filtered = this.currentCompetition.dances
			.filter(i => i.id != dance.id);
		if(dance.linkedDanceIds?.length > 0) {
			const keySet = new Set<keyType>(dance.linkedDanceIds);
			const filteredModified = filtered.map(d => {
				if(keySet.has(d.id)) {
					return { ...d, 
						linkedDanceIds: d.linkedDanceIds.filter(k => k !== dance.id)
					};
				}
				return d;
			});
			this.replaceAll(filteredModified, CompKeys.Dances);
			return;
		}
		this.replaceAll(filtered, CompKeys.Dances);
	}

	removeSkillLevel(skillLevel: SkillLevel): void {
		if(!this.currentCompetition.skillLevels) return;
		this.replaceAll(this.currentCompetition.skillLevels
			.filter(i => i.id !== skillLevel.id), 
			CompKeys.SkillLevls);
	}

}
