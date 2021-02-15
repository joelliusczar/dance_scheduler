import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Unsubscribable } from 'rxjs';
import { CompetitionSetupService } from '../services/competition-setup/competition-setup.service';
import { SocialEvent } from '../types/social-event';
import { DEFAULT_COMPETITION, EMPTY_COMPETITION } from '../types/constants';


@Component({
  selector: 'app-add-comp-modal',
  templateUrl: './add-comp-modal.component.html',
  styleUrls: ['./add-comp-modal.component.sass']
})
export class AddCompModalComponent implements OnInit {

	loading = true;
	options: SocialEvent[] = [];
	private serviceUnsub: Unsubscribable;

	constructor(public dialogRef: MatDialogRef<AddCompModalComponent>,
		@Inject(MAT_DIALOG_DATA) public data: SocialEvent,
		private competitionService$: CompetitionSetupService) { }

  ngOnInit(): void {
		this.serviceUnsub = this.competitionService$
			.arraySubscribe((value: SocialEvent[]) => {
				this.options = value;
				this.loading = false;
		});
	}

	getEventName(event: SocialEvent): string {
		if(!event) return 'Invalid';
		if(event.name) return event.name;
		if(event.eventDate || event.createDate) {
			const d = event.eventDate || event.createDate;
			const s = `comp${d.getFullYear()}${d.getMonth()}${d.getDate}_${d.getTime()}`;
			return s;
		}
		return 'Invalid';
	}
	
	onCancel(): void {
		this.dialogRef.close();
	}

	ngOnDestroy(): void {
		this.serviceUnsub.unsubscribe();
	}

}
