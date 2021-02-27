import { Component, EventEmitter, Inject, Input, OnInit, Output } 
	from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DSInput } from 'src/app/types/ds-input';
import { TagsConfig, TAGS_CONFIG } from '../select/tags-config';

@Component({
  selector: 'app-tag-list',
  templateUrl: './tag-list.component.html',
	styleUrls: ['./tag-list.component.sass'],
	providers: [
		{
			provide: TAGS_CONFIG,
			useFactory: () => new BehaviorSubject<TagsConfig>(null)
		},
	]
})
export class TagListComponent implements OnInit {

	@Input('name') controlName = '';
	@Input('value') tags: any[];
	@Input('readonly') readonly: boolean;
	@Output('onRemoved') removedEvent = new EventEmitter<DSInput>();
	optionMaxIdx: number = 0; 
	tagConfig: TagsConfig;

	
  constructor(@Inject(TAGS_CONFIG) private tagConfig$: BehaviorSubject<TagsConfig>) { }

  ngOnInit(): void {
		this.tagConfig = {
			onClickCallback: this.onTagXClicked.bind(this),
			controlName: this.controlName,
			register: () => ({ idx: this.optionMaxIdx++ }),
			showXButton: this.removedEvent.observers.length > 0.
		};
		this.tagConfig$.next(this.tagConfig);
	}
	
	onTagXClicked(option: DSInput): void {
		this.removedEvent.emit(option);
	}

}
