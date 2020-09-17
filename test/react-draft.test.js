const { cleanup, renderPage } = require('./setup')

afterAll(cleanup)

test(`Should be able to switch between Activities`, () => {
  return renderPage().then(async ({ page }) => {
    await page.waitFor('[data-test-explorer-icon]')

    async function checkActivities() {
      return page.evaluate(() => {
        const explorer =
          document.querySelector('[data-test-explorer-icon]').parentElement.dataset.selected === ''
        const props =
          document.querySelector('[data-test-props-icon]').parentElement.dataset.selected === ''
        const code =
          document.querySelector('[data-test-code-icon]').parentElement.dataset.selected === ''
        const settings =
          document.querySelector('[data-test-settings-icon]').parentElement.dataset.selected === ''
        return { explorer, props, code, settings }
      })
    }

    // Explorer should already be selected
    const testExplorer = await checkActivities()
    expect(testExplorer).toEqual({ explorer: true, props: false, code: false, settings: false })
  })
}, 30000) // first tests sometimes take a while while the page loads
