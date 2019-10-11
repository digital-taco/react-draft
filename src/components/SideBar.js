import React from 'react'
/** @jsx jsx */
import { css, jsx } from '@emotion/core'

const drawerCss = css`
  padding-top: 8px;
  background-color: var(--color-background-secondary);
  transition: margin-right 0.2s ease-in-out;
  display: flex;
  flex-direction: column;
  width: 385px;
  color: var(--color-text);
`

export default function SideBar({ open, children }) {
  return open ? (
    <div css={drawerCss}>
      {children}
    </div> 
  ) : null
}
