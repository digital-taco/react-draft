const { cleanup, renderPage } = require('./setup')

afterAll(cleanup);

test(`Should be able to switch between Activities`, () => {
  return renderPage().then(async ({ browser, page }) => {
    await page.waitFor('[data-test-explorer-icon]');

    async function checkActivities() {
      return await page.evaluate(() => {
        let explorer = document.querySelector('[data-test-explorer-icon]').dataset.selected === ''
        let props = document.querySelector('[data-test-props-icon]').dataset.selected === ''
        let settings = document.querySelector('[data-test-settings-icon]').dataset.selected === ''
        return {explorer, props, settings}
      })
    }

    // Explorer should already be selected
    let testExplorer = await checkActivities()
    expect(testExplorer).toEqual({explorer: true, props: false, settings: false})
  })
}, 30000) // first tests sometimes take a while while the page loads
