import { Injectable } from '@angular/core';
import { openDB, IDBPDatabase } from 'idb';
import { TableTypes } from 'src/app/types/table-types';

const DANCE_SCHEDULER_LOCAL_DB_VERSION = 1;
const DANCE_SCHEDULER_LOCAL_DB_NAME = "danceSchedulerLocalDb"
export const COMPETITION_TABLE_NAME = 'competitions';
export const PEOPLE_TABLE_NAME = 'people';
export const SCHOOL_TABLE_NAME = 'schools';

@Injectable({
  providedIn: 'root'
})
export class BrowserDbService {

	db: IDBPDatabase;
	isOpen = false;

	constructor() { }

	async openDb(): Promise<IDBPDatabase | false> {
		try {
			this.db = await openDB(DANCE_SCHEDULER_LOCAL_DB_NAME, 
				DANCE_SCHEDULER_LOCAL_DB_VERSION, {
					upgrade(db: IDBPDatabase) {
						if(!db.objectStoreNames.contains(PEOPLE_TABLE_NAME)) {
							const personStore = db.createObjectStore(PEOPLE_TABLE_NAME, 
								{ autoIncrement : false, keyPath: 'id' });
							personStore.createIndex('id', 'id');
						}
						if(!db.objectStoreNames.contains(COMPETITION_TABLE_NAME)) {
							const compStore = db.createObjectStore(COMPETITION_TABLE_NAME, 
								{ autoIncrement : false, keyPath: 'id' });
							compStore.createIndex('id', 'id');
						}
						if(!db.objectStoreNames.contains(SCHOOL_TABLE_NAME)) {
							const schoolStore = db.createObjectStore(SCHOOL_TABLE_NAME, 
								{ autoIncrement : false, keyPath: 'id' });
							schoolStore.createIndex('id', 'id');
						}
					},
				});
			this.isOpen = true;
		}
		catch(err){ 
			console.error(err);
			return false;
		}
	}

	async getValue(tableName: string, id: any): Promise<TableTypes> {
		const transaction = this.db.transaction(tableName, 'readonly');
		const store = transaction.objectStore(tableName);
		return await store.get(id); 
	}

	async getAllValues(tableName: string): Promise<TableTypes[]> {
		const transaction = this.db.transaction(tableName, 'readonly');
		const store = transaction.objectStore(tableName);
		return await store.getAll();
	}

	async putValue(tableName: string, value: any) 
		: Promise<IDBValidKey> 
	{
		const transaction = this.db.transaction(tableName, 'readwrite');
		const store = transaction.objectStore(tableName);
		const result = await store.put(value);
		return result;
	}

	async deleteValue(tableName: string, id: any): Promise<void> {
		const transaction = this.db.transaction(tableName, 'readwrite');
		const store = transaction.objectStore(tableName);
		await store.delete(id);
	}

}
