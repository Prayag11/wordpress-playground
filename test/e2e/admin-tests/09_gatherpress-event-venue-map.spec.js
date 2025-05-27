const { test, expect } = require('@playwright/test');
const { login } = require('../reusable-user-steps/common.js');

test.describe.skip(
	'e2e test for event, the user should view the event map on event post.',
	() => {
		test.beforeEach(async ({ page }) => {
			test.setTimeout(12000);

			await page.waitForLoadState('networkidle');
		});

		test.skip('Test to create a new offline event and verify the entered location map should be visible on the event post.', async ({
			page,
		}) => {
			// await login({ page });

			const postName = 'offline event-pune location';

			await page.goto(
				'http://localhost:8881/wp-admin/post-new.php?post_type=gatherpress_event'
			);

			await page.getByLabel('Add title').fill(postName);

			await page
				.getByLabel('Block: Event Date')
				.locator('div')
				.first()
				.isVisible();
			await page
				.getByRole('heading', { name: 'Date & time' })
				.isVisible();

			const settingButton = await page.getByLabel('Settings', {
				exact: true,
			});

			const settingExpand = await settingButton.getAttribute(
				'aria-expanded'
			);

			if (settingExpand === 'false') {
				await settingButton.click();
			}
			await expect(settingButton).toHaveAttribute(
				'aria-expanded',
				'true'
			);

			const eventButton = await page.getByRole('button', {
				name: 'Event settings',
			});
			const eventExpand = await eventButton.getAttribute('aria-expanded');

			if (eventExpand === 'false') {
				await eventButton.click();
			}

			await expect(eventButton).toHaveAttribute('aria-expanded', 'true');

			await page
				.getByLabel('Venue Selector')
				.selectOption('venue pune', { timeout: 25000 });

			await expect(page.locator('#map')).toBeVisible({ timeout: 25000 });

			await page
				.getByRole('button', { name: 'Publish', exact: true })
				.click();
			await page
				.getByLabel('Editor publish')
				.getByRole('button', { name: 'Publish', exact: true })
				.click();

			await page
				.getByText(`${postName} is now live.`)
				.isVisible({ timeout: 60000 }); // verified the event is live.

			await page
				.getByLabel('Editor publish')
				.getByRole('link', { name: 'View Event' })
				.click();

			await page.locator('#map').isVisible({ timeout: 30000 });

			await page.waitForSelector('#map');
			await expect(page).toHaveScreenshot('pune_event_location_map.png', {
				maxDiffPixels: 1000,
				fullPage: true,
				mask: [page.locator('.wp-block-gatherpress-event-date')],
			});
		});
	}
);
