import { Story, Meta, moduleMetadata } from '@storybook/angular';
import { TagListComponent } from '../app/shared/components/tag-list/tag-list.component';

export default {
	title: 'Example/TagList',
	component: TagListComponent,
	decorators: [
		moduleMetadata({
			declarations: [TagListComponent],
		})
	]
} as Meta;

const Example: Story<TagListComponent> = (args: TagListComponent) => ({
	component: TagListComponent,
	props: args
});

export const Template: Story = (args) => ({
	template: `<app-tag-list [value]="[{id: '234', name: 'value2'}]"></app-tag-list>`
});

export const Top = Example.bind({});
Top.args = {
	tags: [{id: '123', name: 'value1'}]
};