import React from 'react'
/** @jsx jsx */
import { css, jsx } from '@emotion/core'

import FolderIcon from '../svgs/FolderIcon'
import FolderOpenIcon from '../svgs/FolderOpenIcon'
import CodeIcon from '../svgs/CodeIcon'

let styles = {
  file: css`
    cursor: pointer;
    padding-left: 15px;
    border-left: 1px solid grey;
    padding: 2px;

    &[data-selected="true"] {
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
  folder: css`
    
  `,
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
      fill: var(--color-text-selected);;
      vertical-align: bottom;
    }
  `,
}

const RecursiveFileSystem = ({ tree }) => {
  let children = []
  Object.keys(tree).forEach(item => {
    let type = typeof tree[item]
    let selected = tree[item].selected
    if (type === 'function') { // function is onClick for optimization reasons
      children.push(
        <div css={styles.file} data-selected={selected} onClick={tree[item]}>
          <CodeIcon />
          {item}
        </div>
      )
    } else {
      children.push(
        <div css={styles.folder}>
          <div css={styles.folderName}>
            <FolderOpenIcon />
            {item}
          </div>
          <div css={styles.folderContents}>
            <RecursiveFileSystem tree={tree[item]} />
          </div>
        </div>
      )
    }
  })

  return (
    <>
      {children}
    </>
  )
}

const evaluateFiles = (fileStructure) => {
  let { files, currentlySelected, cwd } = fileStructure

  let fileTree = {}

  files.forEach(file => {
    let paths = file.split(/[\\/]/).filter(x => x)
    let fileName = paths[paths.length - 1];
    paths = paths.slice(0, paths.length - 1)
    
    let lastNode = fileTree
    paths.forEach((path, idx) => {
      lastNode[path] = lastNode[path] || {}
      if (idx === paths.length - 1) {
        lastNode[fileName] = () => {
          // send the selected file off to the server
          window.fetch(`/change-selected-file?newPath=${file}`, { method:'post' }).then(() => {
            window.location.reload()
          })
        }
        lastNode[fileName].selected = file === currentlySelected;
      } else {
        lastNode = lastNode[path]
      }
    })
  });

  return { fileTree: <RecursiveFileSystem tree={fileTree} />, currentlySelected, cwd }
}

export default function Explorer({}) {
  const [files, setFiles] = React.useState({})
  const { fileTree, currentlySelected, cwd } = files;

  React.useEffect(() => {
    window.fetch('/files').then(x => x.json()).then(x => setFiles(evaluateFiles(x)))
  }, [currentlySelected])
  
  return (
    <div>
      {fileTree}
    </div>
  )
}
