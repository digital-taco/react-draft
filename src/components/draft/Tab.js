/* eslint-disable jsx-a11y/interactive-supports-focus */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useContext } from 'react'
import { css } from '@emotion/core'
import { SelectedContext } from '../contexts/SelectedContext'
import { TabsContext } from '../contexts/TabsContext'
import componentMeta from '../../../out/component-meta'
import CloseIcon from '../../svgs/CloseIcon'
import { boolAttr } from '../../lib/helpers'

const tabCss = css`
  padding: 0 16px;
  display: flex;
  align-items: center;
  cursor: pointer;
  position: sticky;
  height: 48px;
  box-sizing: border-box;
  font-size: 16px;
  line-height: 48px;
  font-weight: 500;
  top: 0;
  color: white;
  transition: all 0.05s linear;

  &:hover,
  &[data-selected] {
    background-color: #fff2;
  }

  &:hover svg,
  &[data-selected] svg {
    fill: white;
  }

  &[temp] {
    font-style: italic;
  }
`

const nameCss = css`
  margin: 0 8px;
`

const closeIconCss = css`
  margin-top: 2px;
  &,
  & svg {
    transition: all 0.05s linear;
    line-height: 20px;
    height: 20px;
    width: 20px;
    fill: var(--color-background-primary);
  }
`

export default function Tab({ temp, name, filePath, componentHash }) {
  const { updateSelectedComponent, SelectedComponent } = useContext(SelectedContext)
  const { removeTab } = useContext(TabsContext)

  const isSelected = SelectedComponent.componentHash === componentHash

  // If the tab is for a component that isn't in the tree anymore, remove the tab
  if (!componentMeta[componentHash]) {
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
      <div css={nameCss}>{name}</div>

      <div css={closeIconCss} role="button" onClick={handleRemoveTab}>
        <CloseIcon data-close fill="var(--color-text)" />
      </div>
    </div>
  )
}
