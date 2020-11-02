import { Component, Directive, Input } from '@angular/core';

@Directive()
class Icon {
	@Input() public strokeColor: string;
	@Input() public width: number;
	@Input() public height: number;
}

@Component({
	selector: 'ds-expand-icon',
	template: `
		<svg class="expand-icon" viewBox="0 0 12.5 12.5" 
			[style.stroke]="strokeColor"
			[style.width]="width"
			[style.height]="height"
		>
			<path d="M4.5,11.25 l5,-5 l-5,-5" fill="none" />
		</svg>`,
	styleUrls: ['./icons.component.sass']
})
export class ExpandIconComponent extends Icon {}


@Component({
	selector: 'ds-hide-icon',
	template: `
		<svg class="hide-icon" viewBox="0 0 12.5 12.5" 
			[style.stroke]="strokeColor"
			[style.width]="width"
			[style.height]="height"
		>
			<path d="M1.25,5 l5,5 l5,-5" fill="none" />
		</svg>`,
	styleUrls: ['./icons.component.sass']
})
export class HideIconComponent extends Icon {}