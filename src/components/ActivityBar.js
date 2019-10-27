import React from 'react'
/** @jsx jsx */
import { css, jsx } from '@emotion/core'
import SettingsIcon from '../svgs/SettingsIcon.js'
import FolderIcon from '../svgs/FolderIcon.js'
import PropsIcon from '../svgs/PropsIcon.js'

const activityBarCss = css`
  height: 100vh;
  width: 60px;
  background-color: var(--color-background);
  color: white;
  display: grid;
  grid-template-rows: 40px 40px 40px;
  grid-row-gap: 12px;
  align-items: center;
  box-sizing: border-box;
  padding: 15px;

  & svg {
    height: 30px;
    width: 30px;
    fill: var(--color-text);
    cursor: pointer;
    transition: all 0.1s ease-in-out;
  }

  & svg:hover {
    fill: var(--color-text-hover);
    opacity: 0.8;
  }

  & svg[data-selected] {
    fill: var(--color-text-selected);
  }
`

export default function ActivityBar({ drawerIsOpen, setDrawerIsOpen, drawerView, setDrawerView }) {
  function handleClick(drawerType) {
    setDrawerView(drawerType)
    if (drawerView === drawerType || !drawerIsOpen) {
      setDrawerIsOpen(prev => !prev)
    }
  }

  return (
    <div css={activityBarCss}>
      <PropsIcon
        data-selected={drawerView === 'props' ? '' : undefined}
        onClick={() => handleClick('props')}
      />
      <FolderIcon
        data-selected={drawerView === 'explorer' ? '' : undefined}
        onClick={() => handleClick('explorer')}
      />
      <SettingsIcon
        data-selected={drawerView === 'settings' ? '' : undefined}
        onClick={() => handleClick('settings')}
      />
    </div>
  )
}
