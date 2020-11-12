import { Injectable } from '@angular/core';
import { Subject, Unsubscribable } from 'rxjs';
import { TableTypes } from 'src/app/types/data-shape';
import { BrowserDbService } from '../browser-Db/browser-db.service';
import { v4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class ListService<T extends TableTypes> {

	private items: T[];
	private items$ = new Subject<T[]>();
	protected tableName: string;

	constructor(private browserDb: BrowserDbService) { }
	
	async loadItems(): Promise<T[]> {
		if(this.items) return this.items;
		if(!this.browserDb.isOpen) {
			await this.browserDb.openDb();
		}
		const values = await this.browserDb.getAllValues(this.tableName);
		this.items = values as T[];
		return this.items;
	}

	async subscribe(
		next?: ((value: T[]) => void) | null,
		error?: ((error: any) => void) | null,
		complete?: (() => void) | null
		): Promise<Unsubscribable> {
			const unsub = this.items$.subscribe(next, error, complete);
			await this.loadItems();
			this.items$.next(this.items);
			return unsub;
	}

	replaceAll(items: T[]): void {
		this.items = items;
		this.items$.next(items);
	}

	saveItem(item: T): void {
		if(!this.items) {
			this.items = [];
		}
		if(!item.id){
			item.id = v4();
		}
		this.browserDb.putValue(this.tableName, item);
		this.items.push(item);
		this.replaceAll(this.items);
	}

	removeItem(item: T): void {
		if(!this.items || !item) return;
		this.browserDb.deleteValue(this.tableName, item.id);
		this.replaceAll(this.items.filter(i => i.id !== item.id));
	}
}
