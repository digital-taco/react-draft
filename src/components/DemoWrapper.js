import React, { useContext } from 'react'
/** @jsx jsx */
import { css, jsx } from '@emotion/core'
// import AppBar from '@material-ui/core/AppBar'
// import Toolbar from '@material-ui/core/Toolbar'
// import IconButton from '@material-ui/core/IconButton'
// import MenuIcon from '@material-ui/icons/Settings'
import PropsDrawer from './PropsDrawer'
import useLocalStorage from '../useLocalStorage'
// import EditDrawer from './EditDrawer'
import ActivityBar from './ActivityBar'
import SideBar from './SideBar'
import Explorer from './Explorer'
import Settings from './Settings/Settings'
import { SettingsContext } from './Settings/SettingsProvider'

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
    overflow-y: scroll;
    min-height: 0;
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

export default function DemoWrapper({
  propObjects,
  displayName,
  children,
  propStates,
  setPropStates,
  resetToDefaults,
  componentTree,
  SelectedComponent,
  updateSelectedComponent,
}) {
  const [drawerIsOpen, setDrawerIsOpen] = useLocalStorage('drawerIsOpen', true)
  const [drawerView, setDrawerView] = useLocalStorage('drawerView', true)

  const [editDrawerOpen, setEditDrawerOpen] = useLocalStorage('editDrawerOpen', true)
  const [editItem, setEditItem] = useLocalStorage(`${displayName}_editItem`, null)

  const { settings } = useContext(SettingsContext)

  function updatePropState(propName, newState) {
    setPropStates(oldPropStates => ({
      ...oldPropStates,
      [propName]: newState,
    }))
  }

  return (
    <div css={styles.grid}>
      {/* APP BAR */}
      <ActivityBar
        drawerIsOpen={drawerIsOpen}
        setDrawerIsOpen={setDrawerIsOpen}
        drawerView={drawerView}
        setDrawerView={setDrawerView}
      />

      {/* SIDEBAR */}
      <SideBar open={drawerIsOpen}>
        {/* PROPS VIEW */}
        {drawerView === 'props' && (
          <PropsDrawer
            propStates={propStates}
            open={drawerIsOpen && drawerView === 'props'}
            propObjects={propObjects}
            setEditItem={setEditItem}
            updatePropState={updatePropState}
            resetToDefaults={resetToDefaults}
          />
        )}

        {/* EXPLORER VIEW */}
        {drawerView === 'explorer' && (
          <Explorer
            componentTree={componentTree}
            SelectedComponent={SelectedComponent}
            updateSelectedComponent={updateSelectedComponent}
          />
        )}

        {/* SETTINGS VIEW */}
        {drawerView === 'settings' && <Settings />}
      </SideBar>

      {/* DEMO */}
      <div
        css={styles.wrapper}
        style={{
          padding: `${settings.demoPadding}px`,
          backgroundColor: settings.backgroundColor || '#fff',
        }}
      >
        {children}
      </div>
    </div>
  )
}
