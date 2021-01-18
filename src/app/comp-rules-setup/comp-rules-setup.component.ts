import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-comp-rules-setup',
  templateUrl: './comp-rules-setup.component.html',
  styleUrls: ['./comp-rules-setup.component.sass']
})
export class CompRulesSetupComponent implements OnInit {

	showAgeGroups: boolean;
	showDanceCategories: boolean;
	showDances: boolean;
	showSkillLvls: boolean;

	ngOnInit(): void {
	}
	
}
