import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import { msg, parseMsg, deserialize } from '../lib/helpers'
import Components from '../../out/master-exports'
import ErrorBoundary from './ErrorBoundary'

function deserializeAll(states) {
  return Object.fromEntries(Object.entries(states).map(([s,v]) => [s, deserialize(v)]))
}

function Page() {
  const [SelectedComponent, setSelectedComponent] = useState(null)
  const [propStates, setPropStates] = useState({})

  function receiveMessage(type, data) {
    switch (type) {
      // When a new component is selected in the explorer
      case 'SELECTED_COMPONENT':
        if (process.env.DEBUG) console.log('DEMO | Message Received: ', type, data)
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

  return SelectedComponent ? (
    <ErrorBoundary key={SelectedComponent.meta.componentHash}>
      <Wrapper>
        {SelectedComponent && <SelectedComponent {...deserializeAll(propStates)} />}
      </Wrapper>
    </ErrorBoundary>
  ) : <div>No demo, son</div>
}

// Render the demo in the dom
ReactDOM.render(<Page />, document.getElementById('demo'))
