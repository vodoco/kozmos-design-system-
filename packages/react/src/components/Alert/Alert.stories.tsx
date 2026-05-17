import type { Meta, StoryObj } from '@storybook/react';
import { Alert, AlertTitle, AlertDescription } from './Alert';
import { Terminal } from 'lucide-react';

const meta: Meta<typeof Alert> = {
    title: 'Feedback/Alert',
    component: Alert,
};

export default meta;
type Story = StoryObj<typeof Alert>;

export const Default: Story = {
    render: () => (
        <Alert>
            <Terminal className="h-4 w-4" />
            <AlertTitle>Heads up!</AlertTitle>
            <AlertDescription>
                You can add components to your app using the cli.
            </AlertDescription>
        </Alert>
    ),
};

export const Destructive: Story = {
    render: () => (
        <Alert variant="destructive">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
                Your session has expired. Please log in again.
            </AlertDescription>
        </Alert>
    ),
};

export const Success: Story = {
    render: () => (
        <Alert variant="success">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>
                Your changes have been saved successfully.
            </AlertDescription>
        </Alert>
    ),
};

export const Warning: Story = {
    render: () => (
        <Alert variant="warning">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Warning</AlertTitle>
            <AlertDescription>
                Your account is about to expire. Please renew your subscription.
            </AlertDescription>
        </Alert>
    ),
};

export const Info: Story = {
    render: () => (
        <Alert variant="info">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Info</AlertTitle>
            <AlertDescription>
                Scheduled maintenance is planned for tonight.
            </AlertDescription>
        </Alert>
    ),
};
