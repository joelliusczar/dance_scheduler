import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { School } from 'src/app/types/data-shape';


@Component({
  selector: 'app-edit-school-modal',
  templateUrl: './edit-school-modal.component.html',
  styleUrls: ['./edit-school-modal.component.sass']
})
export class EditSchoolModalComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<EditSchoolModalComponent>,
		@Inject(MAT_DIALOG_DATA) public data: School) { }

  ngOnInit(): void {
	}
	
	onCancel(): void {
		this.dialogRef.close();
	}

	ngOnDestroy(): void {
	}

}
