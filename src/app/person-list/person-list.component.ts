import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Unsubscribable } from 'rxjs';
import { EditPersonModalComponent } 
	from './edit-person-modal/edit-person-modal.component';
import { Person, PersonDto } from '../types/data-shape';
import { PersonsService } from '../services/persons/persons.service';
import { DanceAppDataSource } from '../shared/utils/DanceAppDataSource';
import { TableStats } from '../types/table-stats';

@Component({
  selector: 'app-dancer-list',
  templateUrl: './person-list.component.html',
  styleUrls: ['./person-list.component.sass']
})
export class PersonListComponent implements OnInit {

	dataSource: DanceAppDataSource<Person, PersonDto>;
	displayedColumns = ['name', 'school'];
	itemCount = 0;
	loading = true;
	private serviceUnsub: Unsubscribable;

	constructor(public dialog: MatDialog,
		private personService: PersonsService) 
	{ 
		this.dataSource = new DanceAppDataSource(personService);
	}

  ngOnInit(): void {
		this.serviceUnsub = this.personService.subscribeStats(
			(value: TableStats) => {
				this.itemCount = value.itemCount;
				this.loading = value.loading;
			});
	}
	
	openDialog(): void {
		const dialogRef = this.dialog.open(EditPersonModalComponent, {
			width: '250px',
			data: { firstName: null, lastName: null, schoolId: null }
		});

		dialogRef.afterClosed().subscribe(result => {
			if(!result) return;
			this.personService.saveItem(result);
		});
	}

	viewItem(item: Person): void {
		console.log(item);
	}

	ngDestroy(): void {
		this.serviceUnsub.unsubscribe();
	}

}
