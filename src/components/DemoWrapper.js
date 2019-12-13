import React, { useContext } from 'react'
import { css } from '@emotion/core'
import PropsDrawer from './PropsDrawer'
import EditDrawer from './EditDrawer'
import ActivityBar from './ActivityBar'
import SideBar from './SideBar'
import Explorer from './Explorer'
import Settings from './Settings/Settings'
import { SettingsContext } from './Settings/SettingsProvider'
import { StorageContext } from './StorageContext'
import Tabs from './Tabs'
import BadRenderMessage from './BadRenderMessage'
import SideBarTitle from './SideBarTitle'

const wrapperCss = css`
  display: grid;
  height: 100vh;
  max-height: 100vh;
  grid-template-rows: 48px 1fr;
`

const contentCss = css`
  height: 100%;
  display: flex;
  background: #283048;
  background: linear-gradient(to left, #859398, #283048);
  max-height: calc(100vh - 48px);
`

const barCss = css`
  display: flex;
  color: var(--color-text);
  background-color: var(--color-background-primary);
`

const boxCss = css`
  padding: 16px 16px 16px 0;
  box-sizing: border-box;
`

const containerCss = css`
  box-sizing: border-box;
  box-shadow: 0 0 16px 0 #0009;
  border-radius: 3px;
  height: 100%;
  overflow: hidden;
  position: relative;
`

const displayCss = css`
  flex-grow: 2;
`

export default function DemoWrapper({ propObjects, children, componentTree }) {
  const { getItem, setItem } = useContext(StorageContext)

  const drawerView = getItem('DRAFT_drawer_view', 'explorer')
  const drawerIsOpen = getItem('DRAFT_drawer_is_open', true)

  const editDrawerOpen = getItem('DRAFT_edit_drawer_open', false)
  const editItem = getItem('DRAFT_edit_item', { warnings: [] })

  const setEditItem = newEditItem => setItem('DRAFT_edit_item', newEditItem)

  const { settings } = useContext(SettingsContext)

  return (
    <div css={wrapperCss}>
      <div css={barCss}>
        {/* TITLE */}
        <SideBarTitle drawerIsOpen={drawerIsOpen} drawerView={drawerView} />

        {/* TABS */}
        <Tabs />
      </div>
      <div css={contentCss}>


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

        {/* DEMO */}
        <div css={displayCss}>
          <div css={boxCss} style={{paddingLeft: drawerIsOpen ? 16 : 0}}>
            <div
              css={containerCss}
              style={{
                padding: `${settings.demoPadding}px`,
                backgroundColor: settings.hideBackground ? 'transparent' : settings.backgroundColor || '#fff',
              }}
            >
              {children}
            </div>
            {!children && (
               <BadRenderMessage />
            )}
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
    </div>
  )
}
