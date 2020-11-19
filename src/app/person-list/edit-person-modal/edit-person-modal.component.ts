import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Unsubscribable } from 'rxjs';
import { SchoolsService } from 'src/app/services/schools/schools.service';
import { Person, School } from 'src/app/types/data-shape';



@Component({
  selector: 'app-add-dancer-modal',
  templateUrl: './edit-person-modal.component.html',
  styleUrls: ['./edit-person-modal.component.sass']
})
export class EditPersonModalComponent implements OnInit {

	schoolChoices: School[];
	loading = true;
	private serviceUnsub: Unsubscribable;

	constructor(public dialogRef: MatDialogRef<EditPersonModalComponent>,
		@Inject(MAT_DIALOG_DATA) public data: Person,
		private schoolService: SchoolsService) { }

  ngOnInit(): void {
		this.serviceUnsub = this.schoolService.subscribe(
			(value: School[]) => {
				this.schoolChoices = value;
				this.loading = false;
			})
  }

	onCancel(): void {
		this.serviceUnsub.unsubscribe();
		this.dialogRef.close();
	}
	
}
