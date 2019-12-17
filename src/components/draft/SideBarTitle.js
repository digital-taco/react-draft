import React from 'react'
import { css } from '@emotion/core'

const titleCss = css`
  width: 459px;
  padding-left: 76px;
  line-height: 48px;
  text-transform: uppercase;
  font-weight: bold;
  box-sizing: border-box;
`

/** The title displayed on the app bar above the sidebar (e.g. Settings/Explorer/Props) */
export default function SideBarTitle({ sideBarIsOpen, sidebarView }) {
  return (
    <div className="demo-font" css={titleCss} style={{
      marginLeft: sideBarIsOpen ? 0 : -459
    }}>
      {sidebarView}
    </div>
  )
}
