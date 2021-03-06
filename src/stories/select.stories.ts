import { Story, Meta, moduleMetadata } from '@storybook/angular';
import { SelectComponent } 
	from '../app/shared/components/select/select.component';
import { TagListComponent } 
	from '../app/shared/components/tag-list/tag-list.component';
import { ElementFilterPipe } 
	from '../app/shared/pipes/element-filter/element-filter.pipe';
import { HideIconComponent }
	from '../app/shared/components/icons/icons.component';
import { SelectOptionComponent }
	from '../app/shared/components/select/select-option/select-option.component';
import { TagItemComponent }
	from '../app/shared/components/select/tag-item/tag-item.component';

export default {
	title: 'Example/Select',
	component: SelectComponent,
	decorators: [
		moduleMetadata({
			declarations: [SelectComponent, 
				TagListComponent, 
				ElementFilterPipe,
				HideIconComponent,
				SelectOptionComponent,
				TagItemComponent,
			],
		})
	]
} as Meta;

export const Empty: Story = (args) => ({
	template: `<app-select></app-select>`
});

export const HasOptions: Story = (args) => ({
	template: `<app-select>
		<app-select-option
			value="123"
		>
			Option 1
		</app-select-option>
		<app-select-option
			value="234"
		>
			Option 2
		</app-select-option>
		<app-select-option
			value="345"
		>
			Option 3
		</app-select-option>
	</app-select>`
});


export const MultiSelect: Story = (args) => ({
	template: `<app-select
		multiple="true"
	>
		<app-select-option
			value="123"
		>
			Option 1
		</app-select-option>
		<app-select-option
			value="234"
		>
			Option 2
		</app-select-option>
		<app-select-option
			value="345"
		>
			Option 3
		</app-select-option>
	</app-select>`
});


export const MultiSelectPreSelect: Story = (args) => ({
	template: `<app-select
		multiple="true"
		[value]="['123','234']"
	>
		<app-select-option
			value="123"
		>
			Option 1
		</app-select-option>
		<app-select-option
			value="234"
		>
			Option 2
		</app-select-option>
		<app-select-option
			value="345"
		>
			Option 3
		</app-select-option>
	</app-select>`
});

export const MultiSelectPreSelectStringValue: Story = (args) => ({
	template: `<app-select
		multiple="true"
		value="123,234"
	>
		<app-select-option
			value="123"
		>
			Option 1
		</app-select-option>
		<app-select-option
			value="234"
		>
			Option 2
		</app-select-option>
		<app-select-option
			value="345"
		>
			Option 3
		</app-select-option>
	</app-select>`
});


export const HasOptionsMultiInstanceNoName: Story = (args) => ({
	template: `
	<div>
		<app-select>
			<app-select-option
				value="123"
			>
				Option 1
			</app-select-option>
			<app-select-option
				value="234"
			>
				Option 2
			</app-select-option>
			<app-select-option
				value="345"
			>
				Option 3
			</app-select-option>
		</app-select>
	</div>
	<div>
		<app-select>
			<app-select-option
				value="123"
			>
				Option 1
			</app-select-option>
			<app-select-option
				value="234"
			>
				Option 2
			</app-select-option>
			<app-select-option
				value="345"
			>
				Option 3
			</app-select-option>
		</app-select>
	</div>
	`
});

export const HasOptionsMultiInstanceName: Story = (args) => ({
	template: `
	<div>
		<app-select name="alpha">
			<app-select-option
				value="123"
			>
				Option 1
			</app-select-option>
			<app-select-option
				value="234"
			>
				Option 2
			</app-select-option>
			<app-select-option
				value="345"
			>
				Option 3
			</app-select-option>
		</app-select>
	</div>
	<div>
		<app-select name="bravo">
			<app-select-option
				value="123"
			>
				Option 1
			</app-select-option>
			<app-select-option
				value="234"
			>
				Option 2
			</app-select-option>
			<app-select-option
				value="345"
			>
				Option 3
			</app-select-option>
		</app-select>
	</div>
	`
});


export const HasOptionsWithDefault: Story = (args) => ({
	template: `<app-select>
		Default Choice
		<app-select-option
			value="123"
		>
			Option 1
		</app-select-option>
		<app-select-option
			value="234"
		>
			Option 2
		</app-select-option>
		<app-select-option
			value="345"
		>
			Option 3
		</app-select-option>
	</app-select>`
});