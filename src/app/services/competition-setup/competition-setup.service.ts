import { Injectable } from '@angular/core';
import { Unsubscribable, Subject, PartialObserver } from 'rxjs';
import { AgeGroupType, Category, Dance, Competition } 
	from 'src/app/types/data-shape';
import { Sortable } from 'src/app/types/sortable';
import { BrowserDbService, COMPETITION_TABLE_NAME } 
	from '../browser-Db/browser-db.service';
import { swap } from '../../shared/utils/arrayHelpers';
import { Direction, ElevatorDir } from 'src/app/types/directions';
import { v4 } from 'uuid';
import { NumericKeySelectable } from 'src/app/types/IdSelectable';

enum CompKeys {
	AgeGroups = 'ageGroups',
	Categories = 'categories',
	Dances = 'dances'
}

@Injectable({
  providedIn: 'root'
})
export class CompetitionSetupService {

	private competitions: Competition[];
	private currentCompetition: Competition;
	private competitions$ = new Subject<Competition>();

	constructor(private browserDb: BrowserDbService) { }
	
	async _triggerLoadItems() : Promise<void> {
		if(this.currentCompetition) {
			this.competitions$.next(this.currentCompetition);
			return;
		}
		if(!this.browserDb.isOpen) {
			await this.browserDb.openDb();
		}
		const values = await this.browserDb.getAllValues(COMPETITION_TABLE_NAME);
		this.competitions = values as Competition[];
		if(this.competitions?.length) {
			this.currentCompetition = this.competitions
				.reduce((a, c) => c.lastUpdated > a.lastUpdated ? c : a);
		}
		else {
			this.currentCompetition = { id: v4() } as any;
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
			this._triggerLoadItems();
			return unsub;
	}

	private ReplaceAll<T>(items: T[], key: string): void {
		this.currentCompetition[key] = items;
		this.browserDb.putValue(COMPETITION_TABLE_NAME, this.currentCompetition);
		this.competitions$.next({
			...this.currentCompetition,
			[`${key}`]: items,
		});
	}

	ReplaceAllAgeGroups(ageGroups: AgeGroupType[]): void {
		this.ReplaceAll(ageGroups, CompKeys.AgeGroups);
	}

	ReplaceAllCategories(categories: Dance[]): void {
		this.ReplaceAll(categories, CompKeys.Categories);
	}

	ReplaceAllDances(dances: Dance[]): void {
		this.ReplaceAll(dances, CompKeys.Dances);
	}

	private SaveItem<T extends Sortable & NumericKeySelectable>
		(item: T, key: string): void 
	{
		if(!this.currentCompetition[key]) {
			this.currentCompetition[key] = [];
		}
		item.order = this.currentCompetition[key].length;
		item.key =  Date.now();
		
		this.currentCompetition[key].push(item);
		this.ReplaceAll(this.currentCompetition[key], key);
	}

	SaveAgeGroup(ageGroup: AgeGroupType): void {
		this.SaveItem(ageGroup, CompKeys.AgeGroups);
	}

	SaveCategory(category: Category): void {
		this.SaveItem(category, CompKeys.Categories);
	}

	SaveDance(dance: Dance): void {
		this.SaveItem(dance, CompKeys.Dances);
	}

	private moveItem<T extends Sortable>(item: T, direction: ElevatorDir, 
		key: string): void 
	{
		const increment = direction === Direction.Up ? 1 : -1;
		if(swap(this.currentCompetition[key], item.order, item.order + increment)) {
			const swapped = this.currentCompetition[key][item.order];
			swapped.order -= increment;
			item.order += increment;
			this.ReplaceAll(this.currentCompetition[key], key);
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

	removeAgeGroup(ageGroup: AgeGroupType): void {
		if(!this.currentCompetition.ageGroups) return;
		this.ReplaceAll(this.currentCompetition.ageGroups
			.filter(i => i.name != ageGroup.name), 
			CompKeys.AgeGroups);
	}

	removeCategory(category: Category): boolean {
		if(!this.currentCompetition.categories) return false;
		const hasDependants = this.currentCompetition.dances
			.some(d => d.category.key === category.key);
		if(hasDependants) return false;
		this.ReplaceAll(this.currentCompetition.categories
			.filter(i => i.name != category.name), 
			CompKeys.Categories);
		return true;
	}

	removeDance(dance: Dance): void {
		if(!this.currentCompetition.dances) return;
		this.ReplaceAll(this.currentCompetition.dances
			.filter(i => i.name != dance.name), 
			CompKeys.Dances);
	}

}
