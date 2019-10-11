import React, { useState, useEffect } from 'react'
import { css } from '@emotion/core'
import CloseIcon from '@material-ui/icons/Close'
import IconButton from '@material-ui/core/IconButton'
import AceEditor from 'react-ace'
import Divider from '@material-ui/core/Divider'
import indigo from '@material-ui/core/colors/indigo'
import amber from '@material-ui/core/colors/amber'
import Collapse from '@material-ui/core/Collapse'
import 'brace/mode/json'
import 'brace/theme/github'

const styles = {
  editDrawer: css`
    border: solid 1px rgba(0, 0, 0, 0.12);
    border-left: none;
    border-right: none;
    background-color: #fcfcfc;
    transition: margin-right 0.2s ease-in-out;

    & .ace_editor {
      width: 100% !important;
      height: 50vh !important;
      max-height: 50vh !important;
      box-sizing: border-box;
      font-family: monospace;
      font-weight: 500;
    }
  `,
  header: css`
    padding: 8px 12px;
  `,
  titleBar: css`
    color: ${indigo[500]};
    font-size: 16px;
    display: flex;
    align-items: center;

    & > span {
      flex-grow: 2;
    }

    & > h4 {
      padding: 0;
      margin: 0;
    }
  `,
  warningsLabel: css`
    font-size: 12px;
    margin-left: 16px;
    color: ${amber[800]};
    cursor: pointer;

    &:hover {
      text-decoration: underline;
    }
  `,
  warnings: css`
    margin: 0;
    /* padding-left: 8px; */
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
export default function EditDrawer({ open, setOpen, editItem, updatePropState, setEditItem }) {
  if (!editItem) return null
  const [warningsOpen, setWarningsOpen] = useState(false)
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

  return (
    <div css={styles.editDrawer} style={style} className="demo-font">
      <div css={styles.header}>
        {/* TITLE */}
        <div css={styles.titleBar}>
          <h4 className="demo-font">{editItem.propName}</h4>
          {warningLength > 0 && (
            // eslint-disable-next-line
            <div css={styles.warningsLabel} onClick={() => setWarningsOpen(!warningsOpen)}>
              {editItem.warnings.length} warning{pluralWarnings && 's'}
            </div>
          )}
          <span />

          {/* CLOSE BUTTON */}
          <IconButton size="small" onClick={handleClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </div>

        {/* WARNINGS */}
        {warningLength > 0 && (
          <Collapse in={warningsOpen}>
            <div css={styles.warnings}>
              {editItem.warnings.map(warning => (
                <div css={styles.warning}>{warning}</div>
              ))}
            </div>
          </Collapse>
        )}
      </div>

      <Divider />

      {/* EDITOR */}
      <AceEditor
        ref={editorRef}
        mode="json"
        showPrintMargin={false}
        editorProps={{
          displayIndentGuides: false,
        }}
        value={
          typeof editItem.value === 'object'
            ? JSON.stringify(editItem.value, null, 4)
            : editItem.value
        }
        theme="github"
        name="test editor"
        onChange={newText => {
          try {
            let newValue

            if (editItem.valueType === 'jsx') {
              // transform the JSX here
              // eslint-disable-next-line no-undef
              // newText = Babel.transform(newText, {
              //   presets: ['es2015', 'react'],
              //   parserOpts: { sourceType: 'script', minified: true },
              // }).code
              // console.log('TCL: EditDrawer -> newText', newText)
              // newValue = newText ? eval(newText) : undefined // eslint-disable-line
              newValue = newText
            } else {
              newValue = newText ? eval(`() => (${newText})`)() : undefined // eslint-disable-line
            }

            console.log('TCL: EditDrawer -> newValue', newValue)
            updatePropState(editItem.propName, newValue) // eslint-disable-line
            setEditItem({ ...editItem, value: newText })
          } catch (e) {
            console.error(e)
          }
        }}
      />
    </div>
  )
}
