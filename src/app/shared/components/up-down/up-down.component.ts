import { Component, Input, OnInit } from '@angular/core';
import { ElevatorDir, Direction } from '../../../types/directions';
import { Sortable } from '../../../types/sortable';

@Component({
  selector: 'ds-up-down',
  templateUrl: './up-down.component.html',
  styleUrls: ['./up-down.component.sass']
})
export class UpDownComponent implements OnInit {

	@Input('click') arrowClick: (item: Sortable, direction: ElevatorDir) => void;
	@Input() associatedItem: Sortable;
	@Input() size: number;
	direction = Direction;

  constructor() { }

  ngOnInit(): void {
	}
	
	reorderClick(item: Sortable, direction: ElevatorDir): void {
		this?.arrowClick(item, direction);
	}


}
