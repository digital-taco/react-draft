import React, { useContext } from 'react'
import { css } from '@emotion/core'
import { StorageContext } from '../contexts/StorageContext'
import { SIDEBAR_IS_OPEN, SIDEBAR_VIEW } from '../../constants/STORAGE_KEYS'
import componentTree from '../../../out/component-tree'
import PropsDrawer from './PropsDrawer'
import Explorer from './Explorer'
import Settings from './Settings'
import DemoJSX from './DemoJSX'
import SideBarTitle from './SideBarTitle'

const drawerCss = css`
  display: flex;
  flex-direction: column;
  color: var(--color-text);
  box-sizing: border-box;
  overflow-y: scroll;
  max-height: 100%;
  width: 100%;
`

export default function SideBar({ propObjects }) {
  const { getItem } = useContext(StorageContext)
  const sideBarIsOpen = getItem(SIDEBAR_IS_OPEN, true)
  const sidebarView = getItem(SIDEBAR_VIEW, true)

  function getSidebarView(view) {
    switch (view) {
      case 'props':
        return <PropsDrawer propObjects={propObjects} />
      case 'explorer':
        return <Explorer componentTree={componentTree} />
      case 'settings':
        return <Settings />
      case 'demo jsx':
        return <DemoJSX />
      default:
        return null
    }
  }

  return sideBarIsOpen ? (
    <div css={drawerCss} className="demo-font">
      <SideBarTitle sideBarIsOpen={sideBarIsOpen} sidebarView={sidebarView} />
      {getSidebarView(sidebarView)}
    </div>
  ) : null
}
