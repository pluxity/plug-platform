import type { Meta, StoryObj } from '@storybook/react';
import { Slider } from './';

const meta: Meta<typeof Slider> = {
    title: 'Components/Slider',
    component: Slider,
    tags: ['autodocs'],
    argTypes:{
      color:{
          control: 'select',
          options: ['primary', 'secondary']
      },
      size:{
          control: 'select',
          options: ['small', 'medium', 'large']
      },
  }
};

export default meta;
type Story = StoryObj<typeof Slider>;

export const Default: Story = {
    render: (args) => (
        <div className="p-4 w-96 relative">
            <h3 className="mb-4 text-lg font-medium">기본 슬라이더</h3>
            <Slider {...args} className="my-6">
                <Slider.Track>
                    <Slider.Thumb />
                </Slider.Track>
                <Slider.Range />
            </Slider>
        </div>
    ),
    args: {
        min: 0,
        max: 100,
        defaultValue: 30,
        step: 1,
    },
};

export const Sizes: Story = {
    render: () => (
        <div className="p-4 w-96 relative">
            <h3 className="mb-4 text-lg font-medium">슬라이더 크기</h3>
            
            <div className="mb-6">
                <p className="text-sm mb-2">Small</p>
                <Slider size="small" defaultValue={30} className="my-2">
                    <Slider.Track>
                        <Slider.Thumb />
                    </Slider.Track>
                    <Slider.Range />
                </Slider>
            </div>
            
            <div className="mb-6">
                <p className="text-sm mb-2">Medium</p>
                <Slider size="medium" defaultValue={50} className="my-2">
                    <Slider.Track>
                        <Slider.Thumb />
                    </Slider.Track>
                    <Slider.Range />
                </Slider>
            </div>
            
            <div className="mb-6">
                <p className="text-sm mb-2">Large</p>
                <Slider size="large" defaultValue={70} className="my-2">
                    <Slider.Track>
                        <Slider.Thumb />
                    </Slider.Track>
                    <Slider.Range />
                </Slider>
            </div>
        </div>
    ),
};

export const Colors: Story = {
    render: () => (
        <div className="p-4 w-96 relative">
            <h3 className="mb-4 text-lg font-medium">슬라이더 색상</h3>
            
            <div className="mb-6">
                <p className="text-sm mb-2">Primary</p>
                <Slider color="primary" defaultValue={40} className="my-2">
                    <Slider.Track>
                        <Slider.Thumb />
                    </Slider.Track>
                    <Slider.Range />
                </Slider>
            </div>
            
            <div className="mb-6">
                <p className="text-sm mb-2">Secondary</p>
                <Slider color="secondary" defaultValue={60} className="my-2">
                    <Slider.Track>
                        <Slider.Thumb />
                    </Slider.Track>
                    <Slider.Range />
                </Slider>
            </div>
        </div>
    ),
};