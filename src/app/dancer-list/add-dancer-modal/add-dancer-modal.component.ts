import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Person } from 'src/app/types/data-shape';



@Component({
  selector: 'app-add-dancer-modal',
  templateUrl: './add-dancer-modal.component.html',
  styleUrls: ['./add-dancer-modal.component.sass']
})
export class AddDancerModalComponent implements OnInit {

	constructor(public dialogRef: MatDialogRef<AddDancerModalComponent>,
		@Inject(MAT_DIALOG_DATA) public data: Person) { }

  ngOnInit(): void {
  }

	onCancel(): void {
		this.dialogRef.close();
	}
	
}
