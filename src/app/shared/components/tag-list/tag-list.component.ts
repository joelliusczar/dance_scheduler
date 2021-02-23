import { Component, ContentChildren, EventEmitter, Input, OnInit, Output, QueryList } from '@angular/core';
import { Unsubscribable } from 'rxjs';
import { DSInput } from 'src/app/types/ds-input';
import { TagItemComponent } from '../select/tag-item/tag-item.component';

@Component({
  selector: 'app-tag-list',
  templateUrl: './tag-list.component.html',
  styleUrls: ['./tag-list.component.sass']
})
export class TagListComponent implements OnInit {

	@Input('value') tags: any[];
	@Input('readonly') readonly: boolean;
	@Output('onRemoved') removedEvent = new EventEmitter<DSInput>();

	
  constructor() { }

  ngOnInit(): void {
	}
	
	onTagXClicked(option: DSInput): void {
		this.removedEvent.emit(option);
	}

}
