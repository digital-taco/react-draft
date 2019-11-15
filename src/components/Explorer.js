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
`

const itemContainerCss = css`
  display: flex;
  align-items: center;
`

const iconContainerCss = css`
  ${itemContainerCss}
  display: inline-block;
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
    width: 16px;
    height: 16px;
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
    width: 16px;
    height: 16px;
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

function FolderFile({ isFile, path, tree, SelectedComponent, updateSelectedComponent }) {
  const { getItem, setItem } = useContext(StorageContext)
  const storageKey = `DRAFT_${path}`
  const isOpen = getItem(storageKey, false)
  return (
    <div>
      <div
        is-file={isFile ? '' : undefined}
        css={folderNameCss}
        onClick={() => setItem(storageKey, !isOpen)}
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
  const children = []

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
            onClick={() => updateSelectedComponent(filePath, component.displayName)}
          />
        )
      })
    } else {
      children.push(
        <FolderFile
          isFile={isFile}
          path={path}
          tree={isFile ? { [path]: value } : value}
          displayComponents={isFile}
          SelectedComponent={SelectedComponent}
          updateSelectedComponent={updateSelectedComponent}
        />
      )
    }
  })

  return <>{children}</>
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
