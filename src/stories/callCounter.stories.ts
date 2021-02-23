// also exported from '@storybook/angular' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/angular';
import {CallCounterComponent} from './callCounter.component'
import { moduleMetadata } from '@storybook/angular';

export default {
  title: 'Example/CallCounter',
	component: CallCounterComponent,
	decorators: [
		moduleMetadata({
			declarations: [CallCounterComponent]
		})
	]
} as Meta;

const Example: Story<CallCounterComponent> = (args: CallCounterComponent) => ({
  component: CallCounterComponent,
  props: args,
});

export const Primary = Example.bind({});
Primary.args = {
};

export const Template: Story = (args) => ({
	template: `<callCounter></callCounter>`
});
