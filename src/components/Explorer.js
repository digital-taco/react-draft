/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react'
/** @jsx jsx */
import { css, jsx } from '@emotion/core'

import FolderIcon from '../svgs/FolderIcon'
import FileIcon from '../svgs/FileIcon'
import FolderOpenIcon from '../svgs/FolderOpenIcon'
import CodeIcon from '../svgs/CodeIcon'

const styles = {
  file: css`
    cursor: pointer;
    user-select: none;
    padding-left: 15px;
    border-left: 1px solid grey;
    padding: 2px;

    &[data-selected='true'] {
      background-color: var(--color-text-selected);
      color: var(--color-background);
      font-weight: bold;
    }

    &:hover {
      background-color: var(--color-background-highlight);
    }

    & svg {
      margin-right: 5px;
      margin-left: 5px;
      width: 16px;
      height: 16px;
      fill: var(--color-text-accent);
      vertical-align: bottom;
    }
  `,
  folder: css``,
  folderContents: css`
    padding-left: 15px;
    border-left: 1px solid grey;
  `,
  folderName: css`
    color: white;
    padding: 2px;
    cursor: pointer;
    user-select: none;
    & svg {
      margin-right: 5px;
      margin-left: -2px;
      width: 16px;
      height: 16px;
      fill: var(--color-text-selected);
      vertical-align: bottom;
    }
    &:hover {
      background-color: var(--color-background-highlight);
    }
  `,
}

function ExportedComponent ({selected, onClick, displayName}) {
  return (
    <div
      css={styles.file}
      data-selected={selected}
      onClick={onClick}
    >
      <CodeIcon />
      {displayName}
    </div>
  )
}

function FolderFile ({isFile, path, tree, SelectedComponent, updateSelectedComponent}) {
  const [isOpen, setOpen] = React.useState(true)
  return (
    <div css={styles.folder}>
      <div css={styles.folderName} onClick={() => setOpen(o => !o)}>
        {isFile ? <FileIcon fill="#fff" /> : isOpen ? <FolderOpenIcon /> : <FolderIcon />}
        {path}
      </div>
      {isOpen && (
        <div css={styles.folderContents}>
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

export default function Explorer({ componentTree, SelectedComponent, updateSelectedComponent }) {
  return (
    <div>
      <RecursiveFileSystem
        tree={componentTree}
        SelectedComponent={SelectedComponent}
        updateSelectedComponent={updateSelectedComponent}
      />
    </div>
  )
}
