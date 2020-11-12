import { Injectable } from '@angular/core';
import { School } from 'src/app/types/data-shape';
import { BrowserDbService, SCHOOL_TABLE_NAME } from '../browser-Db/browser-db.service';
import { ListService } from '../list/list.service';

@Injectable({
  providedIn: 'root'
})
export class SchoolsService extends ListService<School> {

	tableName = SCHOOL_TABLE_NAME;

	constructor(browserDb: BrowserDbService) { 
		super(browserDb);
	}
	
}
