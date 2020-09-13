import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dancer-list',
  templateUrl: './dancer-list.component.html',
  styleUrls: ['./dancer-list.component.sass']
})
export class DancerListComponent implements OnInit {

	anyRules: boolean;

  constructor() { }

  ngOnInit(): void {
  }

}
