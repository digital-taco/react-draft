/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useContext } from 'react'
/** @jsx jsx */
import { css, jsx } from '@emotion/core'

import FolderIcon from '../svgs/FolderIcon'
import FileIcon from '../svgs/FileIcon'
import FolderOpenIcon from '../svgs/FolderOpenIcon'
import CodeIcon from '../svgs/CodeIcon'
import { SelectedContext } from './SelectedProvider'

const styles = {
  file: css`
    cursor: pointer;
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
    & svg {
      margin-right: 5px;
      margin-left: -2px;
      width: 16px;
      height: 16px;
      fill: var(--color-text-selected);
      vertical-align: bottom;
    }
  `,
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
          <div
            css={styles.file}
            data-selected={
              SelectedComponent.meta.filePath === filePath &&
              SelectedComponent.meta.displayName === component.displayName
            }
            onClick={() => updateSelectedComponent(filePath, component.displayName)}
          >
            <CodeIcon />
            {component.displayName}
          </div>
        )
      })
    } else {
      children.push(
        <div css={styles.folder}>
          <div css={styles.folderName}>
            {isFile ? <FileIcon fill="#fff" /> : <FolderOpenIcon />}
            {path}
          </div>
          <div css={styles.folderContents}>
            <RecursiveFileSystem
              tree={isFile ? { [path]: value } : value}
              displayComponents={isFile}
              SelectedComponent={SelectedComponent}
              updateSelectedComponent={updateSelectedComponent}
            />
          </div>
        </div>
      )
    }
  })

  return <>{children}</>
}

export default function Explorer({ componentTree }) {
  const { SelectedComponent, updateSelectedComponent } = useContext(SelectedContext)

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
