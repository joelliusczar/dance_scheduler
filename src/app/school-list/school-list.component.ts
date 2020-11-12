import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EditSchoolModalComponent } 
	from './edit-school-modal/edit-school-modal.component';
import { School } from '../types/data-shape';
import { SchoolsService } from '../services/schools/schools.service';
import { DanceAppDataSource } from '../shared/utils/DanceAppDataSource';
import { Unsubscribable } from 'rxjs';

@Component({
  selector: 'app-school-list',
  templateUrl: './school-list.component.html',
  styleUrls: ['./school-list.component.sass']
})
export class SchoolListComponent implements OnInit {


	dataSource: DanceAppDataSource<School>;
	displayedColumns = ['name', 'location'];
	itemCount = 0;
	private serviceUnsub: Promise<Unsubscribable>;


	constructor(public dialog: MatDialog, 
		private schoolService: SchoolsService) 
	{ 
		this.dataSource = new DanceAppDataSource(schoolService);
	}

  ngOnInit(): void {
		this.serviceUnsub = this.schoolService.subscribe(
			(value: School[]) => {
				this.itemCount = value.length;
			})
	}
	
	openDialog(): void {
		const dialogRef = this.dialog.open(EditSchoolModalComponent, {
			width: '250px',
			data: { name: null, location: null }
		});

		dialogRef.afterClosed().subscribe(result => {
			this.schoolService.saveItem(result);
		});
	}

	viewItem(item: School): void {
		console.log(item);
	}

	ngDestroy(): void {
		this.serviceUnsub.then((unsub: Unsubscribable) => {
			unsub.unsubscribe();
		});
	}

}
