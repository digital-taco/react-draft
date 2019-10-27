import React from 'react'
/** @jsx jsx */
import { css, jsx } from '@emotion/core'

import FolderIcon from '../svgs/FolderIcon'
import FolderOpenIcon from '../svgs/FolderOpenIcon'
import CodeIcon from '../svgs/CodeIcon'

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

const RecursiveFileSystem = ({ tree, updateSelectedComponent }) => {
  const children = []

  Object.entries(tree).forEach(([path, value]) => {
    const isFile = Array.isArray(value)

    if (isFile) {
      // function is onClick for optimization reasons
      const [filePath, components] = value
      components.forEach(component => {
        children.push(
          <div
            css={styles.file}
            data-selected={false}
            onClick={() => updateSelectedComponent(filePath)}
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
            <FolderOpenIcon />
            {path}
          </div>
          <div css={styles.folderContents}>
            <RecursiveFileSystem tree={value} updateSelectedComponent={updateSelectedComponent} />
          </div>
        </div>
      )
    }
  })

  return <>{children}</>
}

export default function Explorer({ componentTree, SelectedComponent, updateSelectedComponent }) {
  return (
    <div>
      <RecursiveFileSystem tree={componentTree} updateSelectedComponent={updateSelectedComponent} />
    </div>
  )
}
