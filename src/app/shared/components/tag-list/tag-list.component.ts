import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { OptionInfo } from 'src/app/types/option-info';

@Component({
  selector: 'app-tag-list',
  templateUrl: './tag-list.component.html',
  styleUrls: ['./tag-list.component.sass']
})
export class TagListComponent implements OnInit {

	@Input('value') tags: OptionInfo[];
	@Input('readonly') readonly: boolean;
	@Output('onRemoved') removedEvent = new EventEmitter<OptionInfo>();
	
  constructor() { }

  ngOnInit(): void {
	}
	
	onTagXClicked(e: MouseEvent, option: OptionInfo) {
		this.removedEvent.emit(option);
		e.stopPropagation();
	}

}
