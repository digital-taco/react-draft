import React, { useState, useEffect, useContext } from 'react'
import { css } from '@emotion/core'
import AceEditor from 'react-ace'
import 'brace/mode/json'
import 'brace/theme/tomorrow_night_bright'
import { serialize, deserialize, boolAttr } from '../../lib/helpers'
import { SelectedContext } from '../contexts/SelectedContext'
import { EditDrawerContext } from '../contexts/EditDrawerContext'
import ErrorIcon from '../../svgs/ErrorIcon'
import IconButton from '../common/IconButton'
import CloseIcon from '../../svgs/CloseIcon'

const editDrawerCss = css`
  background-color: var(--color-background-primary);
  color: var(--color-text);
  transition: margin-right 0.2s ease-in-out;
  box-shadow: 0 0 8px #333;
  height: 100%;
  display: none;

  & .ace_editor {
    width: 100% !important;
    max-width: 100% !important;
    height: calc(100% - 48px) !important;
    max-height: calc(100% - 48px) !important;
    box-sizing: border-box;
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', 'source-code-pro', monospace;
    font-weight: 600;
    font-size: 16px;
  }

  & .ace_editor {
    height: 100% !important;
  }

  &[isopen] {
    display: block;
  }
`

const headerCss = css`
  padding: 0 16px;
  background-color: var(--color-background-tertiary);
`

const titleBarCss = css`
  font-size: 16px;
  display: flex;
  height: 48px;
  align-items: center;
  & > span {
    flex-grow: 2;
  }

  & > .title {
    padding: 0;
    margin: 0;
    font-weight: 600;
    display: flex;
    min-height: 20px;
  }

  & > div.title svg {
    height: 20px;
    width: 20px;
    fill: var(--color-error-text);
    margin-left: 8px;
  }
`

/** A bottom-opening drawer containing an editor. Allows the user to edit the prop state for objects, shapes, and exact shapes. */
export default function EditDrawer() {
  const { editItem, setEditItem, closeEditDrawer } = useContext(EditDrawerContext)
  if (!editItem) return null

  const [hasError, setHasError] = useState(false)

  const { updatePropState } = useContext(SelectedContext)
  const editorRef = React.useRef()

  /* Close the drawer and remove the current edit item */
  function handleClose() {
    setEditItem(null)
  }

  /* Closes the editDrawer if ESC is pressed */
  function keyboardClose({ keyCode, target }) {
    if (editItem && target.tagName.toLowerCase() !== 'input' && keyCode === 27) {
      closeEditDrawer()
    }
  }

  /* Set the ace editor options */
  useEffect(() => {
    editItem &&
      editorRef.current.editor.setOptions({
        displayIndentGuides: false,
        wrapBehavioursEnabled: false,
        cursor: 'smooth',
        useWorker: false,
      })
  }, [])

  /* Add ESC key shortcut to close the editor when open */
  useEffect(() => {
    document.addEventListener('keyup', keyboardClose)
    return () => document.removeEventListener('keyup', keyboardClose)
  }, [])

  const handleChange = newValue => {
    try {
      let newPropState

      if (editItem.valueType === 'jsx') {
        // transform the JSX here
      } else {
        newPropState = newValue ? eval(`() => (${newValue})`)() : undefined // eslint-disable-line
      }

      const serialized = serialize(newPropState)
      updatePropState(editItem.propName, serialized) // eslint-disable-line
      setEditItem({ ...editItem, value: newValue })
      setHasError(false)
    } catch (e) {
      console.error(e)
      setEditItem({ ...editItem, value: newValue })
      setHasError(true)
    }
  }

  return editItem ? (
    <div css={editDrawerCss} isopen={boolAttr(editItem)} className="demo-font">
      <div css={headerCss}>
        {/* TITLE */}
        <div css={titleBarCss}>
          <div className="title demo-font">
            {editItem.propName} {hasError && <ErrorIcon />}
          </div>

          <span />

          {/* CLOSE BUTTON */}
          <IconButton Icon={CloseIcon} onClick={handleClose} />
        </div>
      </div>

      {/* EDITOR */}
      <AceEditor
        ref={editorRef}
        mode="json"
        showPrintMargin={false}
        editorProps={{
          displayIndentGuides: false,
        }}
        value={deserialize(editItem.value, false)}
        theme="tomorrow_night_bright"
        name="test editor"
        onChange={handleChange}
      />
    </div>
  ) : null
}
