import React, { useContext } from 'react'
/** @jsx jsx */
import { css, jsx } from '@emotion/core'
import PropsDrawer from './PropsDrawer'
import EditDrawer from './EditDrawer'
import ActivityBar from './ActivityBar'
import SideBar from './SideBar'
import Explorer from './Explorer'
import Settings from './Settings/Settings'
import { SettingsContext } from './Settings/SettingsProvider'
import { StorageContext } from './StorageContext'
import Tabs from './Tabs'

const styles = {
  grid: css`
    height: 100vh;
    box-sizing: border-box;
    max-height: 100vh;
    min-height: 100vh;
    display: flex;
  `,
  wrapper: css`
    flex-grow: 2;
    min-height: 0;
    box-sizing: border-box;
    height: 100vh;
    max-height: 100vh;
    overflow-y: scroll;
    position: relative;
  `,
  main: css`
    display: flex;
    width: 100%;
    height: 100%;
    overflow-y: scroll;
    min-height: 0;
    min-width: 0;

    & > .MuiCard-root {
      overflow: scroll;
    }
  `,
  contents: css`
    overflow-y: scroll;
    flex-grow: 1;
    display: grid;
    grid-template-rows: 1fr 1fr;
    min-height: calc(100vh - 64px);
  `,
  appBar: css`
    z-index: 3000;
    position: relative;
    & .MuiIconButton-root {
      margin-right: 8px;
    }
  `,
}

export default function DemoWrapper({ propObjects, children, componentTree }) {
  const { getItem, setItem } = useContext(StorageContext)

  const drawerView = getItem('DRAFT_drawer_view', 'explorer')
  const drawerIsOpen = getItem('DRAFT_drawer_is_open', true)

  const editDrawerOpen = getItem('DRAFT_edit_drawer_open', false)
  const editItem = getItem('DRAFT_edit_item', { warnings: [] })

  const setEditItem = newEditItem => setItem('DRAFT_edit_item', newEditItem)

  const { settings } = useContext(SettingsContext)

  return (
    <div css={styles.grid}>
      {/* APP BAR */}
      <ActivityBar />

      {/* SIDEBAR */}
      <SideBar>
        {/* PROPS VIEW */}
        {drawerView === 'props' && (
          <PropsDrawer
            open={drawerIsOpen && drawerView === 'props'}
            propObjects={propObjects}
            setEditItem={setEditItem}
            openEditDrawer={() => setItem('DRAFT_edit_drawer_open', true)}
          />
        )}

        {/* EXPLORER VIEW */}
        {drawerView === 'explorer' && <Explorer componentTree={componentTree} />}

        {/* SETTINGS VIEW */}
        {drawerView === 'settings' && <Settings />}
      </SideBar>

      <div css={styles.wrapper}>
        {/* TABS */}
        <Tabs />

        {/* DEMO */}
        <div
          style={{
            padding: `${settings.demoPadding}px`,
            backgroundColor: settings.backgroundColor || '#fff',
          }}
        >
          {children}
        </div>
      </div>

      {editDrawerOpen && (
        <EditDrawer
          open={editDrawerOpen}
          setOpen={newValue => setItem('DRAFT_edit_drawer_open', newValue)}
          editItem={editItem}
          setEditItem={setEditItem}
        />
      )}
    </div>
  )
}
