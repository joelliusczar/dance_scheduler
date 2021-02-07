import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Unsubscribable } from 'rxjs';
import { CompetitionSetupService } from '../services/competition-setup/competition-setup.service';
import { Competition } from '../types/data-shape';
import { DataBasic } from '../types/IdSelectable';


@Component({
  selector: 'app-add-comp-modal',
  templateUrl: './add-comp-modal.component.html',
  styleUrls: ['./add-comp-modal.component.sass']
})
export class AddCompModalComponent implements OnInit {

	loading = true;
	options: DataBasic[] = [];
	private serviceUnsub: Unsubscribable;

	constructor(public dialogRef: MatDialogRef<AddCompModalComponent>,
		@Inject(MAT_DIALOG_DATA) public data: DataBasic,
		private competitionService$: CompetitionSetupService) { }

  ngOnInit(): void {
		this.serviceUnsub = this.competitionService$
			.arraySubscribe((value: Competition[]) => {
				this.options = value;
				this.loading = false;
		});
	}
	
	onCancel(): void {
		this.dialogRef.close();
	}

	ngOnDestroy(): void {
		this.serviceUnsub.unsubscribe();
	}

}
