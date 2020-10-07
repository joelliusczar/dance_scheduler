import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ElevatorDir, Direction, DirectionEventArg } from '../../../types/directions';
import { Sortable } from '../../../types/sortable';

@Component({
  selector: 'ds-up-down',
  templateUrl: './up-down.component.html',
  styleUrls: ['./up-down.component.sass']
})
export class UpDownComponent implements OnInit {
	
	@Output('reorderClick') arrowClick = 
		new EventEmitter<DirectionEventArg<Sortable>>();
	@Input() associatedItem: Sortable;
	@Input() size: number;
	direction = Direction;

  constructor() { }

  ngOnInit(): void {
	}
	
	reorderClick(item: Sortable, direction: ElevatorDir): void {
		this?.arrowClick.emit({ item, direction });
	}


}
