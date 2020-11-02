import { Injectable } from '@angular/core';
import { PartialObserver, Unsubscribable, Subject } from 'rxjs';
import { AgeGroupType, Category, Dance, Competition } 
	from 'src/app/types/data-shape';
import { Sortable } from 'src/app/types/sortable';
import { BrowserDbService, COMPETITION_TABLE_NAME } 
	from '../browser-Db/browser-db.service';
import { swap } from '../../shared/utils/arrayHelpers';
import { Direction, ElevatorDir } from 'src/app/types/directions';
import { v4 } from 'uuid';

enum CompKeys {
	AgeGroups = 'ageGroups',
	Categories = 'categories',
	Dances = 'dances'
}

@Injectable({
  providedIn: 'root'
})
export class CompetitionSetupService {

	competitions: Competition[];
	currentCompetition: Competition;
	ageGroups$ = new Subject<AgeGroupType[]>();
	categories$ = new Subject<Category[]>();
	dances$ = new Subject<Dance[]>();

	constructor(private browserDb: BrowserDbService) { }
	
	async loadCompetitions() : Promise<Competition> {
		if(this.currentCompetition) return this.currentCompetition;
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
		return this.currentCompetition;
	}

	async subscribeAgeGroups(
		next?: ((value: AgeGroupType[]) => void) | null,
    error?: ((error: any) => void) | null,
    complete?: (() => void) | null
  ): Promise<Unsubscribable> {
		const unsub =  this.ageGroups$.subscribe(next, error, complete);
		await this.loadCompetitions();
		this.ageGroups$.next(this.currentCompetition.ageGroups);
		return unsub;
	}

	async subscribeCategories(
		next?: ((value: Dance[]) => void) | null,
    error?: ((error: any) => void) | null,
    complete?: (() => void) | null
  ): Promise<Unsubscribable> {
		const unsub = this.categories$.subscribe(next, error, complete);
		await this.loadCompetitions();
		this.categories$.next(this.currentCompetition.categories);
		return unsub;
	}

	async subscribeDances(
		next?: ((value: Dance[]) => void) | null,
    error?: ((error: any) => void) | null,
    complete?: (() => void) | null
  ): Promise<Unsubscribable> {
		const unsub = this.dances$.subscribe(next, error, complete);
		await this.loadCompetitions();
		this.dances$.next(this.currentCompetition.dances);
		return unsub;
	}

	private ReplaceAll<T>(items: T[], key: string): void {
		this.currentCompetition[key] = items;
		this.browserDb.putValue(COMPETITION_TABLE_NAME, this.currentCompetition);
		this[`${key}$`].next(items);
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

	private SaveItem<T extends Sortable>(item: T, key: string): 
		void 
	{
		if(!this.currentCompetition[key]) {
			this.currentCompetition[key] = [];
		}
		item.order = this.currentCompetition[key].length;
		
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

	removeCategory(category: Category): void {
		if(!this.currentCompetition.categories) return;
		this.ReplaceAll(this.currentCompetition.categories
			.filter(i => i.name != category.name), 
			CompKeys.Categories);
	}

	removeDance(dance: Dance): void {
		if(!this.currentCompetition.dances) return;
		this.ReplaceAll(this.currentCompetition.dances
			.filter(i => i.name != dance.name), 
			CompKeys.Dances);
	}

}
