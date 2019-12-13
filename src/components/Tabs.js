/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useContext, useEffect, useState } from 'react'
import { css } from '@emotion/core'
import { StorageContext } from './StorageContext'
import { SelectedContext } from './SelectedProvider'
import Components from '../../out/master-exports'
import CodeIcon from '../svgs/CodeIcon'
import CloseIcon from '../svgs/CloseIcon'
import { TABS } from '../enums/KEYCODES'

const tabsCss = css`
  color: var(--color-text);
  display: flex;
  overflow-x: scroll;
  height: 48px;
  box-sizing: border-box;
`

const tabCss = css`
  padding: 10px 16px 7px;
  display: grid;
  grid-template-columns: max-content 1fr max-content;
  grid-column-gap: 8px;
  align-items: center;
  cursor: pointer;
  position: sticky;
  height: 48px;
  box-sizing: border-box;
  font-size: 16px;
  line-height: 20px;
  border-bottom: solid 3px transparent;
  font-weight: 500;
  top: 0;

  &:hover {
    background-color: var(--color-background-highlight);
  }

  & svg[data-close] {
    fill: var(--color-background-primary);
  }

  &:hover svg[data-close] {
    fill: var(--color-text);
  }

  & svg {
    height: 20px;
    width: 20px;
  }

  &[data-selected] {
    border-bottom: solid 3px var(--color-text-selected);
    background-color: var(--color-background-highlight);
  }

  &[data-selected] svg[data-close] {
    fill: var(--color-text);
  }

  & div[temp] {
    font-style: italic;
  }
`

const closeIconCss = css`
  margin-left: 12px;

  &, & svg {
    height: 16px;
    width: 16px;
  }

  & svg {
    margin-bottom: -1px;
  }
`

export function Tab({ temp, name, filePath, componentHash }) {
  const { getItem, setItem } = useContext(StorageContext)
  const { updateSelectedComponent, SelectedComponent } = useContext(SelectedContext)
  
  const isSelected =
  SelectedComponent && SelectedComponent.meta.displayName === name && SelectedComponent.meta.filePath === filePath
  
  function removeTab(e) {
    if (e) e.stopPropagation()
    if (e) e.preventDefault()
    const tabs = getItem('DRAFT_tabs')
    const tempTab = getItem('DRAFT_temp_tab')

    const index = tabs.findIndex(t => t.name === name && t.filePath === filePath)
    if (tempTab && tempTab.componentHash === componentHash) {
      setItem('DRAFT_temp_tab', null)
    } else if (index !== -1) {
      setItem('DRAFT_tabs', [...tabs.slice(0, index), ...tabs.slice(index + 1, tabs.length)])
    }
    if (isSelected) {
      const newSelectedTab = index > 0 ? tabs[index - 1] : tabs[1]
      if (newSelectedTab) updateSelectedComponent(newSelectedTab.filePath, newSelectedTab.name)
      else updateSelectedComponent(null)
    }
  }

  // If the tab is for a component that isn't in the tree anymore, remove the tab
  if (!Components[componentHash]) {
    removeTab()
    return null
  }

  return (
    <div
      css={tabCss}
      data-selected={isSelected ? '' : undefined}
      onClick={() => updateSelectedComponent(filePath, name)}
    >
      <CodeIcon fill="var(--color-text-accent)" />
      <div temp={temp ? '' : undefined}>{name}</div>
      {/* eslint-disable*/}
      <div css={closeIconCss} role="button" onClick={removeTab}>
        <CloseIcon data-close fill="var(--color-text)" />
      </div>
      {/* eslint-enable */}
    </div>
  )
}

export default function Tabs() {
  const { getItem } = useContext(StorageContext)
  const { updateSelectedComponent } = useContext(SelectedContext)

  const tabs = getItem('DRAFT_tabs', [])
  const tempTab = getItem('DRAFT_temp_tab', null)

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
