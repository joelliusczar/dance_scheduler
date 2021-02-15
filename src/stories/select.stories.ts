import { Story, Meta, moduleMetadata } from '@storybook/angular';
import { SelectComponent } 
	from '../app/shared/components/select/select.component';
import { TagListComponent } 
	from '../app/shared/components/tag-list/tag-list.component';
import { ElementFilterPipe } 
	from '../app/shared/pipes/element-filter/element-filter.pipe';
import { UpDownComponent } 
	from '../app/shared/components/up-down/up-down.component';
import { HideIconComponent }
	from '../app/shared/components/icons/icons.component';

export default {
	title: 'Example/Select',
	component: SelectComponent,
	decorators: [
		moduleMetadata({
			declarations: [SelectComponent, 
				TagListComponent, 
				ElementFilterPipe,
				HideIconComponent,
			],
		})
	]
} as Meta;

const Template: Story<SelectComponent> = (args: SelectComponent) => ({
	component: SelectComponent,
	props: args
});

export const Top = Template.bind({});
Top.args = {
	allowMultiSelect: false
};