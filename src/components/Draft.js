import React, { useState, useContext, useRef, useEffect } from 'react'
import ReactDOM from 'react-dom'
import { hot } from 'react-hot-loader'
import DemoWrapper from './draft/DemoWrapper'
import canRender from '../lib/can-render'
import SettingsProvider from './contexts/SettingsContext'
import SelectedProvider, { SelectedContext } from './contexts/SelectedContext'
import StorageProvider from './contexts/StorageContext'
import EditDrawerProvider from './contexts/EditDrawerContext'
import TabsProvider from './contexts/TabsContext'
import GlossaryProvider from './contexts/GlossaryContext'
import { msg, parseMsg } from '../lib/helpers'
import '../global.css' //eslint-disable-line

function Page() {
  const iframeRef = useRef(null)
  const { SelectedComponent, propStates } = useContext(SelectedContext)
  const { props } = SelectedComponent

  const canRenderComponent = propStates && canRender(props, propStates)
  const handleMessage = parseMsg(receiveMessage)
  const [packageName, setPackageName] = useState('')

  const messageSelectedComponent = () =>
    msg(
      iframeRef.current && iframeRef.current.contentWindow,
      'SELECTED_COMPONENT',
      SelectedComponent
    )

  const messagePropStates = () =>
    msg(iframeRef.current && iframeRef.current.contentWindow, 'PROP_STATES', propStates)

  function receiveMessage(type, data) {
    if (process.env.DEBUG) console.log('[Iframe Messages][Draft]  Message Received: ', type)
    if (type === 'DEMO_INITIALIZED') {
      messageSelectedComponent()
      messagePropStates()
    } else if (type === 'PACKAGE_NAME') {
      setPackageName(data)
    }
  }

  // Set the document title
  useEffect(() => {
    document.title = `Draft ${
      SelectedComponent.componentHash !== 'EmptyDemo' ? `- ${SelectedComponent.displayName}` : ''
    } ${packageName && `(${packageName})`}`
  }, [SelectedComponent, packageName])

  // Add iframe message system handler
  useEffect(() => {
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [])

  // Each time the SelectedComponent updates, update the demo iframe
  useEffect(() => {
    messageSelectedComponent()
  }, [SelectedComponent])

  // Each time the prop states update, update the demo iframe
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

const HotPage = hot(module)(Page)

// Render the demo in the dom
ReactDOM.render(
  <StorageProvider>
    <GlossaryProvider>
      <SelectedProvider>
        <EditDrawerProvider>
          <SettingsProvider>
            <TabsProvider>
              <HotPage />
            </TabsProvider>
          </SettingsProvider>
        </EditDrawerProvider>
      </SelectedProvider>
    </GlossaryProvider>
  </StorageProvider>,
  document.getElementById('app')
)
