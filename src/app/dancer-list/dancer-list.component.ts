import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddDancerModalComponent } 
	from './add-dancer-modal/add-dancer-modal.component';

@Component({
  selector: 'app-dancer-list',
  templateUrl: './dancer-list.component.html',
  styleUrls: ['./dancer-list.component.sass']
})
export class DancerListComponent implements OnInit {

	anyRules: boolean;

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {}
	
	openDialog(): void {
		const dialogRef = this.dialog.open(AddDancerModalComponent, {
			width: '250px',
			data: { firstName: null, lastName: null }
		});

		dialogRef.afterClosed().subscribe(result => {
			console.log(result);
		});
	}

}
