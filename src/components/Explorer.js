/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useContext } from 'react'
/** @jsx jsx */
import { css, jsx } from '@emotion/core'

import FolderIcon from '../svgs/FolderIcon'
import FileIcon from '../svgs/FileIcon'
import ArrowIcon from '../svgs/ArrowIcon'
import CodeIcon from '../svgs/CodeIcon'
import { SelectedContext } from './SelectedProvider'
import { StorageContext } from './StorageContext'

const explorerCss = css`
  letter-spacing: 0.5px;
  font-size: 14px;

  & svg {
    width: 16px;
    height: 16px;
  }
`

const itemContainerCss = css`
  display: flex;
  align-items: center;
  overflow-x: hidden;
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
  color: white;
  border-radius: 2px;

  &:hover {
    background-color: var(--color-background-highlight);
  }

  &[data-selected='true'] {
    background-color: var(--color-text-selected);
    color: white;
    font-weight: bold;
  }

  & svg {
    fill: var(--color-text-accent);
    vertical-align: bottom;
  }
`

const folderContentsCss = css`
  padding-left: 16px;
  border-left: 1px solid var(--color-background-highlight);
`

const folderNameCss = css`
  ${itemContainerCss}
  color: white;
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
    background-color: var(--color-background-highlight);
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
  const storageKey = `DRAFT_${path}`
  const isOpen = getItem(storageKey, false)

  function handleFileClick() {
    // If there is only one component in the file and the file is about to expand, then select the one component
    if (!isOpen && isFile && components.length === 1) {
      updateSelectedComponent(filePath, components[0].displayName)
    }
    setItem(storageKey, !isOpen)
  }

  return (
    <div>
      <div is-file={isFile ? '' : undefined} css={folderNameCss} onClick={handleFileClick}>
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
  const children = []

  const { getItem, setItem } = useContext(StorageContext)
  const tabs = getItem('DRAFT_tabs', [])

  function handleComponentClick(filePath, name) {
    if (
      SelectedComponent.meta.filePath === filePath &&
      SelectedComponent.meta.displayName === name &&
      !tabs.find(t => t.name === name && t.filePath === filePath)
    ) {
      setItem('DRAFT_tabs', [...tabs, { filePath, name }])
    }
    updateSelectedComponent(filePath, name)
  }

  Object.entries(tree).forEach(([path, value]) => {
    const isFile = Array.isArray(value)

    if (isFile && displayComponents) {
      // function is onClick for optimization reasons
      const [filePath, components] = value
      components.forEach(component => {
        children.push(
          <ExportedComponent
            displayName={component.displayName}
            selected={
              SelectedComponent.meta.filePath === filePath &&
              SelectedComponent.meta.displayName === component.displayName
            }
            onClick={() => handleComponentClick(filePath, component.displayName)}
          />
        )
      })
    } else {
      children.push(
        <ExpandableItem
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

export default function Explorer({ componentTree }) {
  const { SelectedComponent, updateSelectedComponent } = useContext(SelectedContext)

  return (
    <div css={explorerCss}>
      <RecursiveFileSystem
        tree={componentTree}
        SelectedComponent={SelectedComponent}
        updateSelectedComponent={updateSelectedComponent}
      />
    </div>
  )
}
