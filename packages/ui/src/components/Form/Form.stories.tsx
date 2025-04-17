import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Form } from './Form'
import { FormItem } from './Form'
import { Input } from '../Input'
import { Button } from '../Button'
import { Checkbox } from '../Checkbox';
import { RadioGroup } from '../Radio';

const meta: Meta = {
  title: 'Components/Form',
  component: Form,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Template: Story = {
    render: () => {
        const handleFinish = (values: Record<string, string>) => {
            alert(`Submitted values: ${JSON.stringify(values, null, 2)}`);
        };
    
        return (
            <Form onSubmit={handleFinish}>
                <FormItem name="username" label='Username'>
                    <Input placeholder="Enter your username" />
                </FormItem>
                <FormItem name="password" label='Password'>
                    <Input type="password" placeholder="Enter your password" />
                </FormItem>
                <Button
                    type="submit"
                    color="primary"
                    disabled={false}
                    >
                    Submit
                </Button>
            </Form>
        );
    }
};

export const Required: Story = {
    render: () => {
        const handleFinish = (values: Record<string, string>) => {
            alert(`Submitted values: ${JSON.stringify(values, null, 2)}`);
        };
    
        return (
            <Form onSubmit={handleFinish}>
                <FormItem name="username" label='Username' required>
                    <Input placeholder="Enter your username" />
                </FormItem>
                <FormItem name="password" label='Password' required>
                    <Input type="password" placeholder="Enter your password" />
                </FormItem>
                <Button
                    type="submit"
                    color="primary"
                    disabled={false}
                >
                    Submit
                </Button>
            </Form>
        );
    }
};

export const WithCheckbox: Story = {
    render: () => {
        const ControlledForm = () => {
            const [isChecked, setIsChecked] = useState(false);

            const handleSubmit = (values: Record<string, string>) => {
                alert(`Submitted values: ${JSON.stringify(values, null, 2)}`);
            };

            return (
                <Form onSubmit={handleSubmit}>
                    <FormItem name="acceptTerms" label="Accept Terms">
                        <Checkbox
                            label="Accept terms and conditions"
                            color="primary"
                            size="medium"
                            type="rectangle"
                            checked={isChecked}
                            onChange={(checked) => setIsChecked(checked)}
                        />
                        <Input />

                    </FormItem>
                    <Button
                        type="submit"
                        color="primary"
                    >
                        Submit
                    </Button>
                </Form>
            );

        }

        return <ControlledForm />;
    }
};

export const WithRadio: Story = {
    render: () => {
        const handleFinish = (values: Record<string, any>) => {
            alert(`Submitted values: ${JSON.stringify(values, null, 2)}`);
        };

        return (
            <Form onSubmit={handleFinish}>
                <FormItem name="gender" label="Gender" required>
                    <RadioGroup name="primary">
                        <RadioGroup.Item value="male">Male</RadioGroup.Item>
                        <RadioGroup.Item value="female">Female</RadioGroup.Item>
                    </RadioGroup>
                </FormItem>
                <Button
                    type="submit"
                    color="primary"
                    disabled={false}
                >
                    Submit
                </Button>
            </Form>
        );
    }
};

export const WithCustomValidation: Story = {
    render: () => {

        채ㅜㄴㅅ

        const handleFinish = (values: Record<string, any>) => {
            alert(`Submitted values: ${JSON.stringify(values, null, 2)}`);
        };

        const validate = (values: Record<string, any>) => {
            const errors: Record<string, string> = {};
            if (!values.username) {
                errors.username = 'Username is required';
            } else if (values.username.length < 5) {
                errors.username = 'Username must be at least 5 characters long';
            }
            if (!values.password) {
                errors.password = 'Password is required';
            } else if (values.password.length < 8) {
                errors.password = 'Password must be at least 8 characters long';
            }
            return errors;
        };

        return (
            <Form onSubmit={handleFinish} validate={validate}>
                <FormItem name="username" label="Username">
                    <Input placeholder="Enter your username" />
                </FormItem>
                <FormItem name="password" label="Password">
                    <Input type="password" placeholder="Enter your password" />
                </FormItem>
                <Button
                    type="submit"
                    color="primary"
                    disabled={false}
                >
                    Submit
                </Button>
            </Form>
        );
    }
};