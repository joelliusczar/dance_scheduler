import { Injectable } from '@angular/core';
import { Subject, Unsubscribable, Subscribable, PartialObserver, Operator } from 'rxjs';
import { TableTypes } from 'src/app/types/data-shape';
import { BrowserDbService } from '../browser-Db/browser-db.service';
import { v4 } from 'uuid';
import { IdSelectable } from 'src/app/types/IdSelectable';
import { TableStats } from 'src/app/types/table-stats';

@Injectable({
  providedIn: 'root'
})
export class ListService<T extends TableTypes, U extends IdSelectable = T> 
	implements Subscribable<U[]> {

	pageSize = 25;
	currentPage = 0;
	sortFn: (a: T, b: T) => number;
	nestedOperator: Operator<T,U[]>;
	private items: T[];
	private items$ = new Subject<U[]>();
	private stats$ = new Subject<TableStats>();
	private cachedItems = new Map<string, U>();
	protected tableName: string;

	constructor(protected browserDb: BrowserDbService) { }
	
	private async _loadItems(): Promise<void> {
		if(this.items) {
			this._sendNext();
			return;
		};
		if(!this.browserDb.isOpen) {
			await this.browserDb.openDb();
		}
		const values = await this.browserDb.getAllValues(this.tableName);
		this.items = values as T[];
		this._sendNext();
	}

	subscribe(
		observerOrNext?: PartialObserver<U[]> | ((value: U[]) => void) | null,
		error?: ((error: any) => void) | null,
		complete?: (() => void) | null
		): Unsubscribable {
			let unsub;
			if(typeof observerOrNext === 'function') {
				unsub = this.items$.subscribe(observerOrNext, error, complete);
			}
			else if(typeof observerOrNext === 'object') {
				unsub = this.items$.subscribe(observerOrNext);
			}
			else {
				throw new Error('Invalid argument.');
			}
			this._loadItems();
			return unsub;
	}

	/*subscribeStats cannot be combined with the base subscribe because
		the base subscribe needs to be able to work with a list of items
		due to requirements from the DataSource interface
	*/
	subscribeStats(
		next?: ((value: TableStats) => void) | null,
		error?: ((error: any) => void) | null,
		complete?: (() => void) | null
	): Unsubscribable {
		const unsub = this.stats$.subscribe(next, error, complete);
		this._loadItems();
		return unsub;
	}

	private _sendNext() {
		const fromIdx = this.currentPage * this.pageSize;
		const usedItems = this.items.slice(fromIdx, fromIdx + this.pageSize);
		const promises = usedItems.map(this.transform);
		Promise.all(promises).then(transformed => {
			this.items$.next(transformed);
			this._sendNextStats();
		});
	}

	private _sendNextStats() {
		if(this.items) {
			this.stats$.next({ 
				itemCount: this.items.length, 
				loading: this.items.length < 1 });
		}
	}


	replaceAll(items: T[]): void {
		this.items = items;
		this._sendNext();
	}

	saveItem(item: U): void {
		if(!this.items) {
			this.items = [];
		}
		if(!item.id){
			item.id = v4();
		}
		const saveble = this.transformInverse(item);
		this.browserDb.putValue(this.tableName, saveble);
		this.cachedItems.set(item.id, item);
		this.items.push(saveble);
		this.replaceAll(this.items);
	}

	removeItem(item: T | U): void {
		if(!this.items || !item) return;
		this.browserDb.deleteValue(this.tableName, item.id);
		this.cachedItems.delete(item.id);
		this.replaceAll(this.items.filter(i => i.id !== item.id));
	}

	async getItemById(id: string): Promise<U | null> {
		if(!id) return null;
		if(this.cachedItems.has(id)) {
			const item = this.cachedItems.get(id);
			return item;
		}
		const item = await this.browserDb.getValue(this.tableName, id) as T;
		if(item) {
			const transformed = await this.transform(item);
			this.cachedItems.set(id, transformed);
			return transformed;
		}
		return null;
	}

	transform(t: T): U | Promise<U> {
		throw new Error('Method not implemented.');
	}

	transformInverse(u: U): T {
		throw new Error('Method not implemented.');
	}

}
