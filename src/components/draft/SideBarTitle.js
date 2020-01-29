import React from 'react'
import { css } from '@emotion/core'

const titleCss = css`
  padding: 16px 16px 8px;
  line-height: 16px;
  text-transform: uppercase;
  font-weight: bold;
  box-sizing: border-box;
`

/** The title displayed on the app bar above the sidebar (e.g. Settings/Explorer/Props) */
export default function SideBarTitle({ sideBarIsOpen, sidebarView }) {
  return (
    <div
      className="demo-font"
      css={titleCss}
      style={{
        marginLeft: sideBarIsOpen ? 0 : -459,
      }}
    >
      {sidebarView}
    </div>
  )
}
