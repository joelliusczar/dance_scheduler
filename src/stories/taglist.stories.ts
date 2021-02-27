import { Story, Meta, moduleMetadata } from '@storybook/angular';
import { TagListComponent } 
	from '../app/shared/components/tag-list/tag-list.component';
import { TagItemComponent }
	from '../app/shared/components/select/tag-item/tag-item.component';

export default {
	title: 'Example/TagList',
	component: TagListComponent,
	decorators: [
		moduleMetadata({
			declarations: [TagListComponent,
				TagItemComponent
			],
		})
	]
} as Meta;


export const Template: Story = (args) => ({
	template: `
	<app-tag-list>
		<app-tag-item value="123">
			Option 1
		</app-tag-item>
		<app-tag-item value="234">
			Option 2
		</app-tag-item>
		<app-tag-item value="345">
			Option 3
		</app-tag-item>	
	</app-tag-list>`
});
