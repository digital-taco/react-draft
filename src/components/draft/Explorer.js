/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useContext } from 'react'
import { css } from '@emotion/core'

import FolderIcon from '../../svgs/FolderIcon'
import FileIcon from '../../svgs/FileIcon'
import ArrowIcon from '../../svgs/ArrowIcon'
import CodeIcon from '../../svgs/CodeIcon'
import { SelectedContext } from '../contexts/SelectedContext'
import { StorageContext } from '../contexts/StorageContext'
import { TabsContext } from '../contexts/TabsContext'
import { GlossaryContext } from '../contexts/GlossaryContext'
import { boolAttr } from '../../lib/helpers'

const explorerCss = css`
  letter-spacing: 0.5px;
  font-size: 14px;
  padding: 0 16px 0 16px;

  & svg {
    width: 16px;
    min-width: 16px;
    height: 16px;
    min-height: 16px;
  }
`

const itemContainerCss = css`
  display: flex;
  align-items: center;
  overflow-x: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const iconContainerCss = css`
  ${itemContainerCss}
  margin-right: 8px;
`

const componentCss = css`
  ${itemContainerCss}
  cursor: pointer;
  user-select: none;
  padding: 2px;
  margin-left: 20px;
  color: var(--color-text-primary);
  border-radius: 2px;

  &[data-selected='true'] {
    /* background-color: var(--color-text-selected); */
    /* color: white; */
    font-weight: bold;
  }

  &:hover {
    /* background-color: var(--color-background-highlight); */
  }

  & svg {
    fill: var(--color-text-accent);
    vertical-align: bottom;
  }
`

const folderContentsCss = css`
  padding-left: 16px;
  border-left: 1px solid #b9b9b9;
`

const folderNameCss = css`
  ${itemContainerCss}
  /* color: white; */
  padding: 4px 0;
  cursor: pointer;
  user-select: none;

  & svg {
    vertical-align: bottom;
  }

  &[is-file] svg {
    fill: var(--color-text);
  }

  &:hover {
    /* background-color: var(--color-background-highlight); */
  }
`

function ItemIcons({ Icon, color = 'var(--color-text)', isOpen, hideArrow }) {
  return (
    <div css={iconContainerCss}>
      {!hideArrow && <ArrowIcon fill="var(--color-text)" direction={isOpen ? 'down' : 'right'} />}
      <Icon fill={color} />
    </div>
  )
}

function ExportedComponent({ selected, onClick, displayName }) {
  return (
    <div css={componentCss} data-selected={selected} onClick={onClick}>
      <ItemIcons hideArrow Icon={CodeIcon} />
      {displayName}
    </div>
  )
}

function ExpandableItem({
  isFile,
  path,
  tree,
  filePath,
  components = [],
  SelectedComponent,
  updateSelectedComponent,
}) {
  const { getItem, setItem } = useContext(StorageContext)
  const { tabs, tempTab, addTab, setTempTab } = useContext(TabsContext)
  const storageKey = `DRAFT_expandable_is_open_${path}`
  const isOpen = getItem(storageKey, false)

  function handleFileClick() {
    // If there is only one component in the file and the file is about to expand, then select the one component
    if (!isOpen && isFile && components.length === 1) {
      const name = components[0].displayName
      if (tempTab && tempTab.filePath === filePath && tempTab.name === name) {
        // if the tab is the temp tab, make it a persistent tab
        addTab(name, filePath)
      } else if (!tabs.find(t => t.name === name && t.filePath === filePath)) {
        // if it is not the temp tab AND it isn't a tab already, make it the temp tab
        setTempTab(name, filePath)
      }
      updateSelectedComponent(filePath, name)
    }
    setItem(storageKey, !isOpen)
  }

  return (
    <div>
      <div
        is-file={boolAttr(isFile)}
        css={folderNameCss}
        onClick={handleFileClick}
        data-test-path={path}
      >
        {/* eslint-disable-next-line no-nested-ternary */}
        <ItemIcons
          Icon={isFile ? FileIcon : FolderIcon}
          isOpen={isOpen}
          color={isFile ? 'var(--color-text)' : 'var(--color-text-selected)'}
        />
        {path}
      </div>

      {isOpen && (
        <div css={folderContentsCss}>
          <RecursiveFileSystem
            tree={tree}
            displayComponents={isFile}
            SelectedComponent={SelectedComponent}
            updateSelectedComponent={updateSelectedComponent}
          />
        </div>
      )}
    </div>
  )
}

const RecursiveFileSystem = ({
  tree,
  SelectedComponent,
  updateSelectedComponent,
  displayComponents,
}) => {
  const { addTab, setTempTab, tempTab, tabs } = useContext(TabsContext)
  const children = []

  function handleComponentClick(filePath, name) {
    if (tempTab && tempTab.filePath === filePath && tempTab.name === name) {
      addTab(name, filePath)
    } else if (!tabs.find(t => t.name === name && t.filePath === filePath)) {
      setTempTab(name, filePath)
    }
    updateSelectedComponent(filePath, name)
  }

  Object.entries(tree).forEach(([path, value], index) => {
    const isFile = Array.isArray(value)

    if (isFile && displayComponents) {
      // function is onClick for optimization reasons
      const [filePath, components] = value
      components.forEach(component => {
        children.push(
          <ExportedComponent
            key={`ec_${filePath}_${component.displayName}`}
            displayName={component.displayName}
            selected={
              SelectedComponent.filePath === filePath &&
              SelectedComponent.displayName === component.displayName
            }
            onClick={() => handleComponentClick(filePath, component.displayName)}
          />
        )
      })
    } else {
      children.push(
        <ExpandableItem
          key={`ei_${index}`}
          isFile={isFile}
          path={path}
          tree={isFile ? { [path]: value } : value}
          displayComponents={isFile}
          filePath={isFile ? value[0] : undefined}
          components={isFile ? value[1] : undefined}
          SelectedComponent={SelectedComponent}
          updateSelectedComponent={updateSelectedComponent}
        />
      )
    }
  })

  return children
}

export default function Explorer() {
  const { SelectedComponent, updateSelectedComponent } = useContext(SelectedContext)
  const { tree } = useContext(GlossaryContext)

  return (
    <div css={explorerCss}>
      <RecursiveFileSystem
        tree={tree}
        SelectedComponent={SelectedComponent}
        updateSelectedComponent={updateSelectedComponent}
      />
    </div>
  )
}
