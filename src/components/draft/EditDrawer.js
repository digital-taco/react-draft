import React, { useState, useEffect, useContext } from 'react'
import { css } from '@emotion/core'
import AceEditor from 'react-ace'
import { SelectedContext } from '../contexts/SelectedContext'
import 'brace/mode/json'
import 'brace/theme/tomorrow_night_bright'
import { serialize, deserialize } from '../../lib/helpers'
import ErrorIcon from '../../svgs/ErrorIcon'

const styles = {
  editDrawer: css`
    background-color: var(--color-background-primary);
    color: var(--color-text);
    transition: margin-right 0.2s ease-in-out;
    position: absolute;
    right: 0;
    box-shadow: 0 0 8px #333;

    & .ace_editor {
      width: 33vw !important;
      height: 100vh !important;
      max-height: 100vh !important;
      box-sizing: border-box;
      font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', 'source-code-pro', monospace;
      font-weight: 600;
      font-size: 16px;
    }
  `,
  header: css`
    padding: 16px;
    background-color: var(--color-background-secondary);
  `,
  titleBar: css`
    font-size: 16px;
    display: flex;
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

    & svg {
      height: 20px;
      width: 20px;
      fill: var(--color-error-text);
      margin-left: 8px;
    }
  `,
  warningsLabel: css`
    font-size: 12px;
    margin-left: 16px;
    color: orange;
    cursor: pointer;

    &:hover {
      text-decoration: underline;
    }
  `,
  warnings: css`
    margin: 0;
    max-width: 100%;
    overflow-x: scroll;
  `,
  warning: css`
    color: red;
    padding: 4px 0;
    margin: 0;
    max-width: 100%;
    overflow-x: scroll;
    font-size: 12px;
  `,
}

/** A bottom-opening drawer containing an editor. Allows the user to edit the prop state for objects, shapes, and exact shapes. */
export default function EditDrawer({ open, setOpen, editItem, setEditItem }) {
  console.log('LOG: EditDrawer -> editItem', editItem)
  if (!editItem) return null
  const [editorValue, setEditorValue] = useState(deserialize(editItem.value))
  const [warningsOpen, setWarningsOpen] = useState(false)
  const [hasError, setHasError] = useState(false)
  const { updatePropState } = useContext(SelectedContext)


  const editorRef = React.useRef()
  const warningLength = editItem.warnings.length
  const pluralWarnings = warningLength > 1
  const style = {
    display: open ? 'block' : 'none',
  }

  /** Close the drawer and remove the current edit item */
  function handleClose() {
    setOpen(false)
    setEditItem(null)
  }

  /** If an editItem was set, and the drawer isn't open, open it */
  useEffect(() => {
    if (!open && editItem) {
      setOpen(true)
    }
  }, [editItem])

  /** Set the ace editor options */
  useEffect(() => {
    editorRef.current.editor.setOptions({
      displayIndentGuides: false,
      wrapBehavioursEnabled: false,
      cursor: 'smooth',
      useWorker: false,
    })
  }, [])

  useEffect(() => {
    try {
      let newPropState

      if (editItem.valueType === 'jsx') {
        // transform the JSX here
        // eslint-disable-next-line no-undef
        // newText = Babel.transform(newText, {
        //   presets: ['es2015', 'react'],
        //   parserOpts: { sourceType: 'script', minified: true },
        // }).code
        // newValue = newText ? eval(newText) : undefined // eslint-disable-line
        // newValue = newText
      } else {
        newPropState = editorValue ? eval(`() => (${editorValue})`)() : undefined // eslint-disable-line
      }

      const serialized = serialize(newPropState)
      console.log('LOG: EditDrawer -> serialized', serialized)
      updatePropState(editItem.propName, serialized) // eslint-disable-line
      setEditItem({ ...editItem, value: editorValue })
      if (hasError) {
        setHasError(false)
      }
    } catch (e) {
      console.error(e)
      setHasError(true)
    }
  }, [editorValue])

  return (
    <div css={styles.editDrawer} style={style} className="demo-font">
      <div css={styles.header}>
        {/* TITLE */}
        <div css={styles.titleBar}>
          <div className="title demo-font">{editItem.propName} {hasError && <ErrorIcon />}</div>

          {/* Warnings */}
          {warningLength > 0 && (
            // eslint-disable-next-line
            <div css={styles.warningsLabel} onClick={() => setWarningsOpen(!warningsOpen)}>
              {editItem.warnings.length} warning{pluralWarnings && 's'}
            </div>
          )}
          <span />

          {/* CLOSE BUTTON */}
          {/* <IconButton size="small" onClick={handleClose}>
            <CloseIcon fontSize="small" />
          </IconButton> */}
          <button onClick={handleClose}>Close</button>
        </div>

        {/* WARNINGS */}
        {warningLength > 0 && (
          <div css={styles.warnings}>
            {editItem.warnings.map(warning => (
              <div css={styles.warning}>{warning}</div>
            ))}
          </div>
        )}
      </div>

      {/* EDITOR */}
      <AceEditor
        ref={editorRef}
        mode="json"
        showPrintMargin={false}
        editorProps={{
          displayIndentGuides: false,
        }}
        value={editorValue}
        theme="tomorrow_night_bright"
        name="test editor"
        onChange={newValue => {
          console.log('LOG: newValue', newValue)
          setEditorValue(newValue)
        }}
      />
    </div>
  )
}