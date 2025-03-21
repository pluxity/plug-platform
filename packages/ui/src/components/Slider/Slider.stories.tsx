import type { Meta, StoryObj } from '@storybook/react';
import { Slider, } from "../Slider";
import { useState } from "react";

const meta: Meta<typeof Slider> = {
    title: 'Components/Slider',
    component: Slider,
    tags: ['autodocs'],
    argTypes:{
    }
}

export default meta;
type Story = StoryObj<typeof Slider>;

export const Default: Story = {
    render: (args) => (
        <Slider 
            step={5}
            defaultValue={80}
            className="w-[200px]"
            {...args}
        >
            <Slider.Track>
                <Slider.Thumb />
            </Slider.Track>
            <Slider.Range />
        </Slider>
    )
};

export const ControlledSlider: Story = {
    render: () => {
        const ControlledSliderDemo = () => {
            const [sliderValue, setSliderValue] = useState<number>(20);
            const SliderChangeValue = (value: number) => {
                setSliderValue(value);
            };
            
            return (
                <>
                    <span>value: {sliderValue}</span>
                    <Slider className="w-[200px]" color="secondary" size="medium" value={sliderValue} onValueChange={SliderChangeValue}>
                        <Slider.Track className="bg-red-500">
                            <Slider.Thumb />
                        </Slider.Track>
                        <Slider.Range />
                    </Slider>
                </>
            );
        };
        
        return <ControlledSliderDemo />;
    }
}

export const Disabled: Story = {
    render: (args) => (
        <Slider 
            disabled
            defaultValue={80}
            className="w-[200px]"
            {...args}
        >
            <Slider.Track>
                <Slider.Thumb />
            </Slider.Track>
            <Slider.Range />
        </Slider>
    )
};