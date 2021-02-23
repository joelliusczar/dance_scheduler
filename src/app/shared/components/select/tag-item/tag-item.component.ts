import { Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { nodeFirst } from 'src/app/shared/utils/domHelper';
import { DSInput } from 'src/app/types/ds-input';

@Component({
  selector: 'app-tag-item',
  templateUrl: './tag-item.component.html',
  styleUrls: ['./tag-item.component.sass']
})
export class TagItemComponent implements OnInit, DSInput {

	@Input('value') value: unknown;
	@Input('readonly') readonly: boolean;
	@Output('onXClicked') onXClickedEvent = new EventEmitter<DSInput>();
	@Input('tabindex') tabNum = -1;
	content = '';
	
  constructor(private elRef: ElementRef) { }

  ngOnInit(): void {
	}
	
	onTagXClicked(e: MouseEvent) {
		this.onXClickedEvent.emit(this);
		e.stopPropagation();
	}

	ngAfterViewChecked(): void {
		const first = nodeFirst(this.elRef?.nativeElement?.children);
		this.content = first?.textContent || '';
	}

}
