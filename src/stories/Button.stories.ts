// also exported from '@storybook/angular' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/angular';
import Button from './button.component';
import { moduleMetadata } from '@storybook/angular';

export default {
  title: 'Example/Button',
	component: Button,
	decorators: [
		moduleMetadata({
			declarations: [Button]
		})
	]
  // argTypes: {
  //   backgroundColor: { control: 'color' },
  // },
} as Meta;

const Example: Story<Button> = (args: Button) => ({
  component: Button,
  props: args,
});

export const Primary = Example.bind({});
Primary.args = {
  //primary: true,
  //words: 'Button',
};

export const Template: Story = (args) => ({
	template: `<storybook-button miText="howdy"></storybook-button>`
});



