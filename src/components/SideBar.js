import React, { useContext } from 'react'
import { css, jsx } from '@emotion/core'
import { StorageContext } from './StorageContext'
/** @jsx jsx */

const drawerCss = css`
  padding: 16px;
  background-color: var(--color-background-secondary);
  transition: margin-right 0.2s ease-in-out;
  display: flex;
  flex-direction: column;
  width: 385px;
  color: var(--color-text);
  box-sizing: border-box;
  overflow-y: scroll;
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
