import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddCompModalComponent } from '../add-comp-modal/add-comp-modal.component';
import { CompetitionSetupService } 
	from '../services/competition-setup/competition-setup.service';
import { Competition } from '../types/competition';
import { DEFAULT_COMPETITION, EMPTY_COMPETITION } from '../types/constants';
import { DataKey } from '../types/data-key';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass']
})
export class HomeComponent implements OnInit {

	constructor(public dialog: MatDialog, 
		private competitionService$: CompetitionSetupService) 
	{ }

  ngOnInit(): void {
	}
	
	openDialog() {
		const diaglogRef = this.dialog.open(AddCompModalComponent, {
			width: '275px',
			data: { id: null, name: null }
		});

		diaglogRef.afterClosed().subscribe(result => {
			if(!result) return;
			console.log(result);
		});
	}

	initializeNewComp(id: DataKey): Competition {
		if(id === DEFAULT_COMPETITION) {
			return Competition.defaultCompetition();
		}
		else if(id === EMPTY_COMPETITION) {
			return new Competition();
		}
		//const comp = this.competitionService$.
		return null;
	}

}
