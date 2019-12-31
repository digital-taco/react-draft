import React, { useContext, useRef } from 'react'
import reactElementToJSXString from 'react-element-to-jsx-string'
import { css } from '@emotion/core'
import copy from 'copy-to-clipboard'
import AceEditor from 'react-ace'
import { SelectedContext } from '../contexts/SelectedContext'
import { deserializeAll } from '../../lib/helpers'
import 'brace/mode/javascript'
import 'brace/theme/dracula'
import Button from '../common/Button'

const jsxCss = css`
  white-space: pre;
  margin: 16px;
  background: var(--color-background-primary);
  overflow: scroll;
  padding-top: 16px;

  border-radius: 4px;

  & div.ace_editor {
    font-weight: 600;
    font-size: 16px;
    line-height: 24px;
    font-family: 'Fira Code', 'Monaco', 'Ubuntu Mono', 'Consolas';
  }

  & div.ace_gutter-layer {
    width: 16px !important;
  }

  & div.ace_scroller {
    left: 16px !important;
  }
`

const actionsCss = css`
  display: flex;
  justify-content: flex-end;
  padding: 16px;
`

const toJsxOptions = {
  showDefaultProps: false,
  showFunctions: true,
}

export default function DemoJSX() {
  const { SelectedComponent, propStates } = useContext(SelectedContext)
  const deserializedPropStates = deserializeAll(propStates)
  const copyButtonRef = useRef(null)
  const jsxEditorRef = useRef(null)

  // Garbage collection does not have enough time to remove undefined props, so they show up when we don't want them to
  // This bit of logic removes any undefined prop states from our deserialized values
  Object.entries(deserializedPropStates).forEach(([k, v]) => {
    if (v === undefined) delete deserializedPropStates[k]
  })

  const jsxString = reactElementToJSXString(
    <SelectedComponent {...deserializedPropStates} />,
    toJsxOptions
  )

  return (
    <div css={jsxCss} className="ace_editor ace-dracula ace_dark">
      <AceEditor
        value={jsxString}
        ref={jsxEditorRef}
        theme="dracula"
        name="demo-jsx-editor"
        mode="javascript"
        setOptions={{
          useWorker: false,
          displayIndentGuides: false,
          wrapBehavioursEnabled: false,
          cursor: 'smooth',
          readOnly: true,
          showPrintMargin: false,
          showLineNumbers: false,
          fontSize: 16,
          highlightActiveLine: false,
          highlightSelectedWord: false,
          highlightGutterLine: false,
        }}
        maxLines={Infinity}
        style={{
          width: 'auto',
        }}
      />
      <div css={actionsCss}>
        <Button ref={copyButtonRef} onClick={() => copy(jsxString)}>
          Copy
        </Button>
      </div>
    </div>
  )
}