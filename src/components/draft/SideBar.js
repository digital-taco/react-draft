import React, { useContext } from 'react'
import { css } from '@emotion/core'
import { StorageContext } from '../contexts/StorageContext'
import { SIDEBAR_IS_OPEN, SIDEBAR_VIEW } from '../../constants/STORAGE_KEYS'
import PropsDrawer from './PropsDrawer'
import Explorer from './Explorer'
import Settings from './Settings'

const drawerCss = css`
  display: flex;
  flex-direction: column;
  color: var(--color-text);
  box-sizing: border-box;
  overflow-y: scroll;
  max-height: 100%;
  width: 100%;
`

export default function SideBar({ componentTree, propObjects }) {
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
      case 'livecode':
        return <span>Hello!</span>
      default:
        return null
    }
  }

  return sideBarIsOpen ? (
    <div css={drawerCss} className="demo-font">
      {getSidebarView(sidebarView)}
    </div>
  ) : null
}
