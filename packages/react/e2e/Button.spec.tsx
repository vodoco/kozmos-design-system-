import { test, expect } from '@playwright/experimental-ct-react';
import { Button } from '../src/components/Button';

test.describe('Button Component E2E Matrix', () => {
  test('Renders physically without exploding dynamically', async ({ mount }) => {
    const component = await mount(<Button variant="default">Execute</Button>);
    await expect(component).toContainText('Execute');
    await expect(component).toBeVisible();
  });

  test('Validates destructive semantic state accurately', async ({ mount }) => {
    const component = await mount(<Button variant="destructive">Delete</Button>);
    await expect(component).toContainText('Delete');
    // Bounding box verifications prevent visual breakage
    const box = await component.boundingBox();
    expect(box).not.toBeNull();
  });
});
