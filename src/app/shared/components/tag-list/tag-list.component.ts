import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DataBasic } from '../../../types/IdSelectable';

@Component({
  selector: 'app-tag-list',
  templateUrl: './tag-list.component.html',
  styleUrls: ['./tag-list.component.sass']
})
export class TagListComponent implements OnInit {

	@Input('value') tags: DataBasic[];
	@Input('readonly') readonly: boolean;
	@Output('onRemoved') removedEvent = new EventEmitter<DataBasic>();
	
  constructor() { }

  ngOnInit(): void {
	}
	
	onTagXClicked(e: MouseEvent, option: DataBasic) {
		this.removedEvent.emit(option);
		e.stopPropagation();
	}

}
