import React, { useContext, useEffect } from 'react'
import { css } from '@emotion/core'
import SettingsIcon from '../../svgs/SettingsIcon'
import FolderIcon from '../../svgs/FolderIcon'
import PropsIcon from '../../svgs/PropsIcon'
import { StorageContext } from '../contexts/StorageContext'
import { ACTIVITY_VIEWS } from '../../constants/KEYCODES'
import { SIDEBAR_VIEW, SIDEBAR_IS_OPEN } from '../../constants/STORAGE_KEYS'

import ReloadNotification from './ReloadNotification'

const activityBarCss = css`
  height: 100%;
  width: 60px;
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

export default function ActivityBar() {
  const { getItem, setItem } = useContext(StorageContext)
  const drawerView = getItem(SIDEBAR_VIEW, 'explorer')
  const drawerIsOpen = getItem(SIDEBAR_IS_OPEN, true)

  function handleClick(drawerType) {
    const isOpen = getItem(SIDEBAR_IS_OPEN, true)
    const currentDrawerView = getItem(SIDEBAR_VIEW, 'explorer')
    if (currentDrawerView === drawerType || !isOpen) {
      setItem(SIDEBAR_IS_OPEN, !isOpen)
    }
    setItem(SIDEBAR_VIEW, drawerType)
  }

  // Add keyboard shortcuts
  useEffect(() => {
    function handleKeyShortcut({ keyCode, target }) {
      if (['input', 'textarea'].includes(target.tagName.toLowerCase())) return
      if (keyCode === ACTIVITY_VIEWS.EXPLORER_VIEW) handleClick('explorer')
      if (keyCode === ACTIVITY_VIEWS.PROPS_VIEW) handleClick('props')
      if (keyCode === ACTIVITY_VIEWS.SETTINGS_VIEW) handleClick('settings')
    }
    document.addEventListener('keyup', handleKeyShortcut)
    return () => document.removeEventListener('keyup', handleKeyShortcut)
  }, [])

  return (
    <div css={activityBarCss}>
      <ReloadNotification />
      <FolderIcon
        data-selected={drawerIsOpen && drawerView === 'explorer' ? '' : undefined}
        onClick={() => handleClick('explorer')}
        data-test-explorer-icon
        />
      <PropsIcon
        data-selected={drawerIsOpen && drawerView === 'props' ? '' : undefined}
        onClick={() => handleClick('props')}
        data-test-props-icon
        />
      <SettingsIcon
        data-selected={drawerIsOpen && drawerView === 'settings' ? '' : undefined}
        onClick={() => handleClick('settings')}
        data-test-settings-icon
      />
    </div>
  )
}
