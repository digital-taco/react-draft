/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useContext, useEffect } from 'react'
import { css } from '@emotion/core'
import { StorageContext } from '../contexts/StorageContext'
import { SelectedContext } from '../contexts/SelectedContext'
import { TabsContext } from '../contexts/TabsContext'
import Tab from './Tab'
import { TABS } from '../../constants/KEYCODES'

const tabsCss = css`
  color: var(--color-text);
  display: flex;
  overflow-x: scroll;
  height: 48px;
  box-sizing: border-box;
`

export default function Tabs() {
  const { updateSelectedComponent } = useContext(SelectedContext)
  const { tabs, tempTab } = useContext(TabsContext)

  // Add keyboard listeners for 1-9 to corresponding tabs
  useEffect(() => {
    const keyToTab = ({ keyCode, target }) => {
      if (['input', 'textarea'].includes(target.tagName.toLowerCase())) return
      const indexOfTab = Object.values(TABS).findIndex(k => k === keyCode)
      if (indexOfTab !== -1) {
        const tab = tabs[indexOfTab]
        if (tab) updateSelectedComponent(tab.filePath, tab.name)
      }
    }
    document.addEventListener('keyup', keyToTab)
    return () => document.removeEventListener('keyup', keyToTab)
  }, [])

  return (
    <div css={tabsCss} className="demo-font">
      {tempTab && <Tab temp {...tempTab} />}
      {tabs.map((tab) => (
        <Tab key={tab.componentHash} {...tab} />
      ))}
    </div>
  )
}
