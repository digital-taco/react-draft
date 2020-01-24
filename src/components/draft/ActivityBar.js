/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useContext, useEffect } from 'react'
import { css } from '@emotion/core'
import SettingsIcon from '../../svgs/SettingsIcon'
import FolderIcon from '../../svgs/FolderIcon'
import PropsIcon from '../../svgs/PropsIcon'
import CodeIcon from '../../svgs/CodeIcon'
import ArrowIcon from '../../svgs/ArrowIcon'
import { StorageContext } from '../contexts/StorageContext'
import { ACTIVITY_VIEWS } from '../../constants/KEYCODES'
import { SIDEBAR_VIEW, SIDEBAR_IS_OPEN, LAST_SELECTED_VIEW } from '../../constants/STORAGE_KEYS'
import { boolAttr } from '../../lib/helpers'

const iconContainerCss = css`
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  flex-grow: 2;
  transition: all 0.03s linear;
  cursor: pointer;
  &:hover,
  &[data-selected] {
    background-color: #fff1;
  }

  &[data-selected] svg {
    opacity: 1;
    fill: var(--color-text-accent);
  }

  & svg {
    height: 22px;
    min-height: 22px;
    width: 22px;
    min-width: 22px;
    opacity: 0.9;
    fill: white;
    cursor: pointer;
    transition: all 0.1s ease-in-out;
  }

  & svg:hover {
    opacity: 0.95;
  }
`

const arrowContainerCss = css`
  transition: all 0.03s linear;
  display: flex;
  align-items: center;
  cursor: pointer;
  width: 20px;
  &:hover {
    background-color: #fff1;
  }
  & svg {
    width: 16px;
    fill: #fff4;
  }
`

const activityBarCss = css`
  height: 100%;
  width: 284px;
  color: white;
  display: flex;
  box-sizing: border-box;
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
    setItem(LAST_SELECTED_VIEW, drawerType)
  }

  // Add keyboard shortcuts
  useEffect(() => {
    function handleKeyShortcut({ keyCode, target }) {
      if (['input', 'textarea'].includes(target.tagName.toLowerCase())) return
      if (keyCode === ACTIVITY_VIEWS.EXPLORER_VIEW) handleClick('explorer')
      if (keyCode === ACTIVITY_VIEWS.PROPS_VIEW) handleClick('props')
      if (keyCode === ACTIVITY_VIEWS.DEMO_JSX) handleClick('demo jsx')
      if (keyCode === ACTIVITY_VIEWS.SETTINGS_VIEW) handleClick('settings')
    }
    document.addEventListener('keyup', handleKeyShortcut)
    return () => document.removeEventListener('keyup', handleKeyShortcut)
  }, [])

  return (
    <div css={activityBarCss}>
      {!drawerIsOpen && (
        <div css={arrowContainerCss} onClick={() => setItem(SIDEBAR_IS_OPEN, true)}>
          <ArrowIcon style={{ transform: 'translateX(-2px) rotate(-90deg)' }} direction="right" />
        </div>
      )}
      <div
        css={iconContainerCss}
        onClick={() => handleClick('explorer')}
        data-selected={boolAttr(drawerIsOpen && drawerView === 'explorer')}
      >
        <FolderIcon data-test-explorer-icon />
      </div>
      <div
        css={iconContainerCss}
        onClick={() => handleClick('props')}
        data-selected={boolAttr(drawerIsOpen && drawerView === 'props')}
      >
        <PropsIcon data-test-props-icon />
      </div>
      <div
        css={iconContainerCss}
        onClick={() => handleClick('demo jsx')}
        data-selected={boolAttr(drawerIsOpen && drawerView === 'demo jsx')}
      >
        <CodeIcon data-test-code-icon />
      </div>
      <div
        css={iconContainerCss}
        onClick={() => handleClick('settings')}
        data-selected={boolAttr(drawerIsOpen && drawerView === 'settings')}
      >
        <SettingsIcon data-test-settings-icon />
      </div>
    </div>
  )
}
