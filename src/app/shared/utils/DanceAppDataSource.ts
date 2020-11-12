import { CollectionViewer } from '@angular/cdk/collections';
import { DataSource } from '@angular/cdk/table';
import { Observable, Subject, Unsubscribable } from 'rxjs';
import { ListService } from 'src/app/services/list/list.service';
import { TableTypes } from 'src/app/types/data-shape';

export class DanceAppDataSource<T extends TableTypes> extends DataSource<T> {

	connectedData = new Subject<T[]>();
	private serviceUnsub: Promise<Unsubscribable>;

	constructor(private listService: ListService<T>) {
		super();
	}

	connect(): Observable<T[] | readonly T[]> {
		this.serviceUnsub = this.listService.subscribe(
			(value: T[]) => {
				this.connectedData.next(value);
			})
		return this.connectedData;
	}

	disconnect(): void {
		this.serviceUnsub.then((unsub: Unsubscribable) => {
			unsub.unsubscribe();
		});
		this.connectedData.complete();
	}

}