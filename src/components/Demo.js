/* eslint-disable import/no-named-as-default */
import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import { hot } from 'react-hot-loader'
import { msg, parseMsg, deserializeAll } from '../lib/helpers'
import Components from '../../out/component-list'
import ErrorBoundary from './demo/ErrorBoundary'
import EmptyDemo from './demo/EmptyDemo'

function Page() {
  const [SelectedComponent, setSelectedComponent] = useState(() => EmptyDemo)
  const [propStates, setPropStates] = useState({})

  function receiveMessage(type, data) {
    if (process.env.DEBUG) console.log('[Iframe Messages][Demo] Message Received: ', type, data)
    switch (type) {
      // When a new component is selected in the explorer
      case 'SELECTED_COMPONENT':
        setSelectedComponent(() => Components[data.componentHash])
        break

      // When the prop states have updated
      case 'PROP_STATES':
        setPropStates(data)
        break

      default:
    }
  }

  const handleMessage = parseMsg(receiveMessage)

  // Notify DRAFT that the demo has initialized
  useEffect(() => {
    window.addEventListener('message', handleMessage)
    msg(window.top, 'DEMO_INITIALIZED', { state: 'ready' })
    return () => window.removeEventListener('message', handleMessage)
  }, [])

  // Wrap the demo in the provided Wrapper or just a fragment
  const Wrapper = Components.Wrapper || React.Fragment

  return (
    <ErrorBoundary key={SelectedComponent.componentHash}>
      <Wrapper>
        <SelectedComponent {...deserializeAll(propStates)} />
      </Wrapper>
    </ErrorBoundary>
  )
}

const HotPage = hot(module)(Page)

// Render the demo in the dom
ReactDOM.render(<HotPage />, document.getElementById('demo'))
