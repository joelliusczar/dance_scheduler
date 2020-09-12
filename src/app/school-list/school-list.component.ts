import { Component, OnInit } from '@angular/core';
import { SchoolService } from '../school/school.service';

@Component({
  selector: 'app-school-list',
  templateUrl: './school-list.component.html',
  styleUrls: ['./school-list.component.sass']
})
export class SchoolListComponent implements OnInit {

  constructor(schoolService: SchoolService) { 
		if(schoolService) {
			console.log('dependancy injection is working');
		}
		else {
			console.log('not working is dependancy injection');
		}
	}

  ngOnInit(): void {
  }

}
