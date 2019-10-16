import React from 'react'
/** @jsx jsx */
import { css, jsx } from '@emotion/core'

const drawerCss = css`
  padding: 16px;
  background-color: var(--color-background-secondary);
  transition: margin-right 0.2s ease-in-out;
  display: flex;
  flex-direction: column;
  width: 385px;
  color: var(--color-text);
  box-sizing: border-box;
`

export default function SideBar({ open, children }) {
  return open ? (
    <div css={drawerCss}>
      {children}
    </div> 
  ) : null
}
