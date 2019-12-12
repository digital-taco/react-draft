import React, { useContext } from 'react'
import { css } from '@emotion/core'
import { StorageContext } from './StorageContext'

const drawerCss = css`
  display: flex;
  flex-direction: column;
  color: var(--color-text);
  box-sizing: border-box;
  overflow-y: scroll;
  min-width: 385px;
  width: 385px;
`

export default function SideBar({ children }) {
  const { getItem } = useContext(StorageContext)
  const drawerIsOpen = getItem('DRAFT_drawer_is_open', true)
  return drawerIsOpen ? (
    <div css={drawerCss} className="demo-font">
      {children}
    </div>
  ) : null
}
