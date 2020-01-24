import React, { useContext, useRef, useEffect } from 'react'
import ReactDOM from 'react-dom'
import DemoWrapper from './draft/DemoWrapper'
import canRender from '../lib/can-render'
import SettingsProvider from './contexts/SettingsContext'
import SelectedProvider, { SelectedContext } from './contexts/SelectedContext'
import StorageProvider from './contexts/StorageContext'
import EditDrawerProvider from './contexts/EditDrawerContext'
import TabsProvider from './contexts/TabsContext'
import { msg, parseMsg } from '../lib/helpers'
import '../global.css' //eslint-disable-line

function Page() {
  const iframeRef = useRef(null)
  const { SelectedComponent, propStates } = useContext(SelectedContext)
  const { props } = SelectedComponent

  const canRenderComponent = propStates && canRender(props, propStates)
  const handleMessage = parseMsg(receiveMessage)

  const messageSelectedComponent = () =>
    msg(
      iframeRef.current && iframeRef.current.contentWindow,
      'SELECTED_COMPONENT',
      SelectedComponent
    )

  const messagePropStates = () =>
    msg(iframeRef.current && iframeRef.current.contentWindow, 'PROP_STATES', propStates)

  function receiveMessage(type) {
    if (process.env.DEBUG) console.log('DRAFT | Message Received: ', type)
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
    messageSelectedComponent()
  }, [SelectedComponent])

  useEffect(() => {
    messagePropStates()
  }, [propStates])

  return (
    <DemoWrapper
      propObjects={props}
      iframeRef={iframeRef}
      canRenderComponent={canRenderComponent}
    />
  )
}

// Render the demo in the dom
ReactDOM.render(
  <StorageProvider>
    <SelectedProvider>
      <EditDrawerProvider>
        <SettingsProvider>
          <TabsProvider>
            <Page />
          </TabsProvider>
        </SettingsProvider>
      </EditDrawerProvider>
    </SelectedProvider>
  </StorageProvider>,
  document.getElementById('app')
)
