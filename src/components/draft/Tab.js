/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useContext } from 'react'
import { css } from '@emotion/core'
import { SelectedContext } from '../contexts/SelectedContext'
import { TabsContext } from '../contexts/TabsContext'
import Components from '../../../out/master-exports'
import CodeIcon from '../../svgs/CodeIcon'
import CloseIcon from '../../svgs/CloseIcon'
import { boolAttr } from '../../lib/helpers'

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

  &[temp] {
    font-style: italic;
  }
`

const closeIconCss = css`
  margin-left: 12px;

  &,
  & svg {
    height: 16px;
    width: 16px;
  }

  & svg {
    margin-bottom: -1px;
  }
`

export default function Tab({ temp, name, filePath, componentHash }) {
  const { updateSelectedComponent, SelectedComponent } = useContext(SelectedContext)
  const { removeTab } = useContext(TabsContext)

  const isSelected = SelectedComponent.meta.componentHash === componentHash

  // If the tab is for a component that isn't in the tree anymore, remove the tab
  if (!Components[componentHash]) {
    removeTab()
    return null
  }

  function handleRemoveTab(e) {
    e.stopPropagation()
    removeTab(componentHash)
  }

  return (
    <div
      css={tabCss}
      data-selected={boolAttr(isSelected)}
      temp={boolAttr(temp)}
      onClick={() => updateSelectedComponent(filePath, name)}
    >
      <CodeIcon fill="var(--color-text-accent)" />
      <div>{name}</div>

      {/* eslint-disable*/}
      <div css={closeIconCss} role="button" onClick={handleRemoveTab}>
        <CloseIcon data-close fill="var(--color-text)" />
      </div>
      {/* eslint-enable */}
    </div>
  )
}
