import React, { useContext } from 'react'
import { css } from '@emotion/core'
import { StorageContext } from '../contexts/StorageContext'
import { DRAWER_IS_OPEN } from '../../constants/STORAGE_KEYS'

const drawerCss = css`
  display: flex;
  flex-direction: column;
  color: var(--color-text);
  box-sizing: border-box;
  overflow-y: scroll;
  max-height: 100%;
  width: 100%;
`

export default function SideBar({ children }) {
  const { getItem } = useContext(StorageContext)
  const drawerIsOpen = getItem(DRAWER_IS_OPEN, true)
  return drawerIsOpen ? (
    <div css={drawerCss} className="demo-font">
      {children}
    </div>
  ) : null
}
