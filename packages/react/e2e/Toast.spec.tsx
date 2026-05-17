import { test, expect } from '@playwright/experimental-ct-react';
import { Toast, ToastAction, ToastProvider, ToastViewport } from '../src/components/Toast';
import React from 'react';

test.describe('Toast Behavioral CT', () => {
    test('visible when open=true, action fires callback', async ({ mount, page }) => {
        let fired = false;
        await mount(
          <ToastProvider duration={100000}>
            <Toast open={true}>
              <span>Message</span>
              <ToastAction altText="Undo" onClick={() => { fired = true; }}>Undo</ToastAction>
            </Toast>
            <ToastViewport />
          </ToastProvider>
        );
        
        // Target explicit action organically
        const btn = page.getByRole('button', { name: 'Undo' });
        await expect(btn).toBeVisible();
        
        // Trigger structural onClick explicitly
        await btn.click();
        expect(fired).toBe(true);
    });
});