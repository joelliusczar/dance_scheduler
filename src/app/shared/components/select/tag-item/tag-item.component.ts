import { Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { nodeFirst } from 'src/app/shared/utils/domHelper';
import { DSInput } from 'src/app/types/ds-input';
import { TagsConfig, TAGS_CONFIG } from '../tags-config';

@Component({
  selector: 'app-tag-item',
  templateUrl: './tag-item.component.html',
  styleUrls: ['./tag-item.component.sass']
})
export class TagItemComponent implements OnInit, DSInput {

	@Input('value') value: unknown;
	@Input('readonly') readonly: boolean;
	@Input('name') controlName: string;
	onClickCallback: (option: TagItemComponent) => void;
	@Input('tabindex') tabNum = -1;
	content = '';
	private inialized: boolean;
	
	constructor(private elRef: ElementRef, 
		@Inject(TAGS_CONFIG) private tagsConfig$: BehaviorSubject<TagsConfig>) { }

  ngOnInit(): void {
		this.tagsConfig$.subscribe((config: TagsConfig) => {
			if(!config) return;
			if(!this.inialized) {
				this.inialized = true;
				const registration = config.register();
				this.controlName = `option-${config.controlName}-${registration.idx}`;
				this.onClickCallback = config.onClickCallback;
				this.readonly = !config.showXButton;
			}
		});
	}
	
	onTagXClicked(e: MouseEvent) {
		this.onClickCallback && this.onClickCallback(this);
		e.stopPropagation();
	}

	ngAfterViewChecked(): void {
		const first = nodeFirst(this.elRef?.nativeElement?.children);
		this.content = first?.textContent || '';
	}

}
