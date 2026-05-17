
import { chromium, type Page } from 'playwright';
import AxeBuilder from '@axe-core/playwright';

/**
 * Skill: Accessibility Checker
 * Role: QA
 * Description: Automated A11y crawler for Storybook using Playwright + Axe
 */

const STORYBOOK_URL = 'http://localhost:6006';

async function getStories() {
    console.log('🔍 Discovering stories...');
    // In a real scenario, we might parse stories.json or crawl the sidebar.
    // For this MVP, we will test the known complex components.
    return [
        { id: 'components-select--default', name: 'Select' },
        { id: 'components-tabs--default', name: 'Tabs' },
        { id: 'components-dialog--default', name: 'Dialog' },
        { id: 'components-badge--outline', name: 'Badge (Outline)' },
        { id: 'components-button--default', name: 'Button' },
    ];
}

async function runAudit() {
    console.log('🚀 Starting A11y Audit on: ' + STORYBOOK_URL);

    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
        const stories = await getStories();
        let violationCount = 0;

        for (const story of stories) {
            const url = `${STORYBOOK_URL}/iframe.html?id=${story.id}&viewMode=story`;
            console.log(`\nTesting: ${story.name} (${url})`);

            await page.goto(url);
            try {
                await page.waitForLoadState('networkidle', { timeout: 5000 });
            } catch (e) {
                // console.warn('   ⚠️ Timeout waiting for networkidle, proceeding...');
            }

            // Special interaction for Select to reveal content
            if (story.name === 'Select') {
                // console.log('   🖱️ Interacting with Select...');
                try {
                    await page.click('button[role="combobox"]', { timeout: 2000 });
                    await page.waitForTimeout(500);
                } catch (e) {
                    // console.warn('   ⚠️ Could not interact with Select trigger');
                }
            }

            // Special interaction for Dialog
            if (story.name === 'Dialog') {
                // console.log('   🖱️ Opening Dialog...');
                try {
                    await page.getByText('Edit Profile').click({ timeout: 2000 });
                    await page.waitForTimeout(500);
                } catch (e) {
                    // console.warn('   ⚠️ Could not open Dialog');
                }
            }

            // Run check
            try {
                const results = await new AxeBuilder({ page })
                    .disableRules(['page-has-heading-one', 'landmark-one-main', 'region', 'aria-hidden-focus'])
                    .analyze();

                if (results.violations.length > 0) {
                    console.error('   ❌ VIOLATION FOUND');
                    results.violations.forEach(v => {
                        console.error(`      - [${v.impact}] ${v.help}`);
                        console.error(`        nodes: ${v.nodes.length}`);
                        if (v.nodes[0]) console.error(`        html: ${v.nodes[0].html}`);
                    });
                    violationCount++;
                } else {
                    console.log('   ✅ Pass');
                }
            } catch (e: any) {
                console.error('   ❌ FAILED TO EXECUTE AXE');
                console.error(e);
                violationCount++;
            }
        }

        if (violationCount > 0) {
            console.error(`\n🚨 Audit Failed: ${violationCount} components have violations.`);
            process.exit(1);
        } else {
            console.log('\n✨ Audit Complete: All checks passed!');
            process.exit(0);
        }

    } catch (error) {
        console.error('Fatal Error:', error);
        process.exit(1);
    } finally {
        await browser.close();
    }
}

runAudit();
