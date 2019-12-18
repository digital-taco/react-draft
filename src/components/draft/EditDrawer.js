import React, { useState, useEffect, useContext } from 'react'
import { css } from '@emotion/core'
import AceEditor from 'react-ace'
import 'brace/mode/json'
import 'brace/theme/tomorrow_night_bright'
import { serialize, deserialize } from '../../lib/helpers'
import { SelectedContext } from '../contexts/SelectedContext'
import ErrorIcon from '../../svgs/ErrorIcon'
import IconButton from '../common/IconButton'
import CloseIcon from '../../svgs/CloseIcon'

const editDrawerCss = css`
  background-color: var(--color-background-primary);
  color: var(--color-text);
  transition: margin-right 0.2s ease-in-out;
  box-shadow: 0 0 8px #333;
  height: 100%;

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

const warningsLabelCss = css`
  font-size: 12px;
  margin-left: 16px;
  color: orange;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`

const warningsCss = css`
   margin: 0;
  max-width: 100%;
  overflow-x: scroll;
`

const warningCss = css`
  color: red;
  padding: 4px 0;
  margin: 0;
  max-width: 100%;
  overflow-x: scroll;
  font-size: 12px;
`

/** A bottom-opening drawer containing an editor. Allows the user to edit the prop state for objects, shapes, and exact shapes. */
export default function EditDrawer({ open, setOpen, editItem, setEditItem }) {
  if (!editItem) return null
  const [editorValue, setEditorValue] = useState(deserialize(editItem.value, false))
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
    <div css={editDrawerCss} style={style} className="demo-font">
      <div css={headerCss}>
        {/* TITLE */}
        <div css={titleBarCss}>
          <div className="title demo-font">{editItem.propName} {hasError && <ErrorIcon />}</div>

          {/* Warnings */}
          {warningLength > 0 && (
            // eslint-disable-next-line
            <div css={warningsLabelCss} onClick={() => setWarningsOpen(!warningsOpen)}>
              {editItem.warnings.length} warning{pluralWarnings && 's'}
            </div>
          )}
          <span />

          {/* CLOSE BUTTON */}
          <IconButton Icon={CloseIcon} onClick={handleClose} />
        </div>

        {/* WARNINGS */}
        {warningLength > 0 && (
          <div css={warningsCss}>
            {editItem.warnings.map(warning => (
              <div css={warningCss}>{warning}</div>
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
          setEditorValue(newValue)
        }}
      />
    </div>
  )
}