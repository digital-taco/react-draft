/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useContext, useEffect } from 'react'
/** @jsx jsx */
import { css, jsx } from '@emotion/core'
import { StorageContext } from './StorageContext'
import { SelectedContext } from './SelectedProvider'
import Components from '../../out/master-exports'
import CodeIcon from '../svgs/CodeIcon'
import CloseIcon from '../svgs/CloseIcon'

const tabsCss = css`
  background-color: var(--color-background);
  color: var(--color-text);
  display: flex;
  overflow-x: scroll;
  position: sticky;
  top: 0;
`

const tabCss = css`
  padding: 12px 16px;
  display: grid;
  grid-template-columns: max-content 1fr max-content;
  grid-column-gap: 8px;
  cursor: pointer;
  position: sticky;
  top: 0;

  &:hover {
    background-color: var(--color-background-highlight);
  }

  & svg[data-close] {
    fill: var(--color-background-secondary);
  }

  &:hover svg[data-close] {
    fill: var(--color-text);
  }

  & svg {
    height: 20px;
    width: 20px;
  }

  &[data-selected] {
    background-color: var(--color-background-secondary);
  }
`

const tabKeyMap = {
  49: 0,
  50: 1,
  51: 2,
  52: 3,
  53: 4,
  54: 5,
  55: 6,
  56: 7,
  57: 8,
  48: 9,
}

export function Tab({ name, filePath, componentHash }) {
  const { getItem, setItem } = useContext(StorageContext)
  const { updateSelectedComponent, SelectedComponent } = useContext(SelectedContext)
  const tabs = getItem('DRAFT_tabs')

  const isSelected =
    SelectedComponent.meta.displayName === name && SelectedComponent.meta.filePath === filePath

  function removeTab(e) {
    if (e) e.stopPropagation()
    if (e) e.preventDefault()
    const index = tabs.findIndex(t => t.name === name && t.filePath === filePath)
    if (index !== -1) {
      setItem('DRAFT_tabs', [...tabs.slice(0, index), ...tabs.slice(index + 1, tabs.length)])
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
      {name}
      {/* eslint-disable*/}
      <div role="button" onClick={removeTab}>
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

  useEffect(() => {
    const keyToTab = ({ keyCode, target }) => {
      if (['input', 'textarea'].includes(target.tagName.toLowerCase())) return
      if (keyCode >= 48 && keyCode <= 57) {
        const tab = tabs[tabKeyMap[keyCode]]
        if (tab) updateSelectedComponent(tab.filePath, tab.name)
      }
    }
    document.addEventListener('keyup', keyToTab)
    return () => document.removeEventListener('keyup', keyToTab)
  }, [])

  return (
    <div css={tabsCss} className="demo-font">
      {tabs.map(tab => (
        <Tab {...tab} />
      ))}
    </div>
  )
}
