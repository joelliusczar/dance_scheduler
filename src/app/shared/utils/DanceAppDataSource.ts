import { CollectionViewer } from '@angular/cdk/collections';
import { DataSource } from '@angular/cdk/table';
import { Observable, Subject, Unsubscribable, from } from 'rxjs';
import { ListService } from 'src/app/services/list/list.service';
import { TableTypes } from 'src/app/types/data-shape';
import { IdSelectable } from 'src/app/types/IdSelectable';

export class DanceAppDataSource<T extends TableTypes, U extends IdSelectable = T> 
	extends DataSource<U> 
{

	connectedData = new Subject<U[]>();
	private serviceUnsub: Unsubscribable;

	constructor(private listService: ListService<T, U>)
	{
		super();
	}

	connect(): Observable<U[] | readonly U[]> {
		const ob = from(this.listService);
		//return ob;
		this.serviceUnsub = this.listService.subscribe(
			(value: U[]) => {
				this.connectedData.next(value);
			})
		return this.connectedData;
	}

	disconnect(): void {
		this.serviceUnsub.unsubscribe();
		this.connectedData.complete();
	}

}