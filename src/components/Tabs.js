/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useContext } from 'react'
/** @jsx jsx */
import { css, jsx } from '@emotion/core'
import { StorageContext } from './StorageContext'
import { SelectedContext } from './SelectedProvider'
import CodeIcon from '../svgs/CodeIcon'
import CloseIcon from '../svgs/CloseIcon'

const tabsCss = css`
  background-color: var(--color-background);
  color: var(--color-text);
  display: flex;
  overflow-x: scroll;
`

const tabCss = css`
  padding: 12px 16px;
  display: grid;
  grid-template-columns: max-content 1fr max-content;
  grid-column-gap: 8px;
  cursor: pointer;

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

export function Tab({ name, filePath }) {
  const { getItem, setItem } = useContext(StorageContext)
  const { updateSelectedComponent, SelectedComponent } = useContext(SelectedContext)
  const tabs = getItem('DRAFT_tabs')

  const isSelected =
    SelectedComponent.meta.displayName === name && SelectedComponent.meta.filePath === filePath

  function removeTab(e) {
    e.stopPropagation()
    e.preventDefault()
    const index = tabs.findIndex(t => t.name === name && t.filePath === filePath)
    if (index !== -1) {
      setItem('DRAFT_tabs', [...tabs.slice(0, index), ...tabs.slice(index + 1, tabs.length)])
    }
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

  const tabs = getItem('DRAFT_tabs', [])

  return (
    <div css={tabsCss}>
      {tabs.map(tab => (
        <Tab name={tab.name} filePath={tab.filePath} />
      ))}
    </div>
  )
}
