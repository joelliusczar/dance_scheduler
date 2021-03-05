import { DataSource } from '@angular/cdk/table';
import { Observable } from 'rxjs';
import { ListService } from 'src/app/services/list/list.service';
import { IdSelectable } from 'src/app/types/id-selectable';
import { TableTypes } from 'src/app/types/table-types';

export class DanceAppDataSource<T extends TableTypes, U extends IdSelectable = T> 
	extends DataSource<U> 
{

	constructor(private listService: ListService<T, U>)
	{
		super();
	}

	connect(): Observable<U[] | readonly U[]> {
		const ob = this.listService.asObservable();
		return ob;
	}

	disconnect(): void {
	}

}