/* eslint-disable import/no-named-as-default */
import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import { hot } from 'react-hot-loader'
import { msg, parseMsg, deserializeAll } from '../lib/helpers'
// import * as components from '../../out/component-list'
import SelectedComponent from '../../out/component-index'
import CustomWrapper from '../../out/custom-wrapper-export'
import ErrorBoundary from './demo/ErrorBoundary'
// import EmptyDemo from './demo/EmptyDemo'

const socket = new WebSocket(`ws://${window.location.hostname}:7998`)

function Page() {
  const [propStates, setPropStates] = useState({})
  const [rebuilding, setRebuilding] = useState(false)
  const [selectedComponent, setSelectedComponent] = useState(false)

  // const SelectedComponent = components[selectedComponent]

  const handleMessage = parseMsg(receiveMessage)
  function receiveMessage(type, data) {
    switch (type) {
      case 'PROP_STATES':
        setPropStates(data)
        break
      case 'SELECTED_COMPONENT_UPDATED':
        setSelectedComponent(data)
        break
    }
  }

  // Notify DRAFT that the demo has initialized
  useEffect(() => {
    window.addEventListener('message', handleMessage)
    msg(window.top, 'DEMO_INITIALIZED', { state: 'ready' })
    return () => window.removeEventListener('message', handleMessage)
  }, [])

  // Add the web socket and it's handler on initialization
  useEffect(() => {
    function handleWSMessage(event) {
      const data = JSON.parse(event.data)
      switch (data.type) {
        case 'REBUILDING_INDEX': {
          setRebuilding(true)
          break
        }
      }
    }

    socket.addEventListener('message', handleWSMessage)
    return () => socket.removeEventListener('message', handleWSMessage)
  }, [])

  // Whenever SelectedComponent updates, it can be safely rendered
  useEffect(() => {
    setRebuilding(false)
  }, [SelectedComponent])

  // Wrap the demo in the provided Wrapper or just a fragment
  // const Wrapper = Components.Wrapper || React.Fragment

  /**
   * Check if the selected component on the server matches what's stored on the client before rendering.
   * There is a slight desync between the two when changing components (client gets updated first).
   */
  function selectedMatch() {
    return (
      selectedComponent.componentName === SelectedComponent.componentName &&
      selectedComponent.filePath === SelectedComponent.filePath
    )
  }

  // TO DO: Fix error boundary resetting by giving it a key, like this: key={SelectedComponent.componentHash}
  return (
    <ErrorBoundary key={SelectedComponent.filePath + SelectedComponent.componentName}>
      <CustomWrapper>
        {rebuilding || !selectedMatch() ? (
          <div
            style={{
              padding: 16,
              fontSize: 12,
              textTransform: 'uppercase',
              opacity: '0.5',
              letterSpacing: '0.5px',
            }}
          >
            Working...
          </div>
        ) : (
          <SelectedComponent {...deserializeAll(propStates)} />
        )}
      </CustomWrapper>
    </ErrorBoundary>
  )
}

const HotPage = hot(module)(Page)

// Render the demo in the dom
ReactDOM.render(<HotPage />, document.getElementById('demo'))
