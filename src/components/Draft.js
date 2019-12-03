import React, { useContext, useRef, useEffect } from 'react'
import ReactDOM from 'react-dom'
import { css } from '@emotion/core'
import Components from '../../out/master-exports'
import DemoWrapper from './DemoWrapper'
import canRender from '../lib/can-render'
import SettingsProvider from './Settings/SettingsProvider'
import SelectedProvider, { SelectedContext } from './SelectedProvider'
import StorageProvider, { StorageContext } from './StorageContext'
import { msg, parseMsg } from '../lib/helpers'

const frameCss = css`
  width: 100%;
  height: 100vh;
  border: none;
  display: block;

  &[data-tabsopen] {
    height: calc(100vh - 47px);
  }
`

import '../global.css' //eslint-disable-line

// Add the app container so react can render
const container = document.createElement('div')
document.body.appendChild(container)
container.setAttribute('id', 'app')

// Add the babel standalone script so we can transpile jsx live
const babelStandalone = document.createElement('script')
babelStandalone.setAttribute('src', 'https://unpkg.com/@babel/standalone/babel.min.js')
babelStandalone.setAttribute('data-presets', 'es2015,react')
document.head.appendChild(babelStandalone)

const { componentTree } = Components

function Page() {
  const iframeRef = useRef(null)
  const { getItem } = useContext(StorageContext)
  const { SelectedComponent, propStates } = useContext(SelectedContext)
  const { meta } = SelectedComponent
  const { props } = meta

  const tabs = getItem('DRAFT_tabs', [])
  const canRenderComponent = propStates && canRender(props, propStates)
  const handleMessage = parseMsg(receiveMessage)

  const messageSelectedComponent = () =>
    msg(iframeRef.current && iframeRef.current.contentWindow, 'SELECTED_COMPONENT', meta)

  const messagePropStates = () => msg(iframeRef.current && iframeRef.current.contentWindow, 'PROP_STATES', propStates)

  function receiveMessage(type) {
    if (type === 'DEMO_INITIALIZED') {
      messageSelectedComponent()
      messagePropStates()
    }
  }

  useEffect(() => {
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [])

  useEffect(() => {
    messageSelectedComponent(), [SelectedComponent]
  })

  useEffect(() => {
    messagePropStates(), [propStates]
  })

  return (
    <DemoWrapper propObjects={props} componentTree={componentTree}>
      {canRenderComponent && (
        <iframe
          ref={iframeRef}
          css={frameCss}
          onLoad={() => {
            iframeRef.current.height = `${iframeRef.current.contentDocument.body.scrollHeight}px`
          }}
          data-tabsopen={tabs.length > 0 ? '' : undefined}
          title="demo"
          src="/demo"
        />
      )}
    </DemoWrapper>
  )
}

// Render the demo in the dom
ReactDOM.render(
  <StorageProvider>
    <SelectedProvider components={Components}>
      <SettingsProvider>
        <Page />
      </SettingsProvider>
    </SelectedProvider>
  </StorageProvider>,
  document.getElementById('app')
)