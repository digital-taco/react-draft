import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import { msg, parseMsg } from '../lib/helpers'
import Components from '../../out/master-exports'
import ErrorBoundary from './ErrorBoundary'

// Add the app container so react can render
const container = document.createElement('div')
document.body.appendChild(container)
container.setAttribute('id', 'demo')

function Page() {
  const [SelectedComponent, setSelectedComponent] = useState(null)
  const [propStates, setPropStates] = useState({})
  const { meta } = SelectedComponent

  function receiveMessage(type, data) {
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

  return SelectedComponent ? (
    <ErrorBoundary key={meta.componentHash}>
      {SelectedComponent && <SelectedComponent {...propStates} />}
    </ErrorBoundary>
  ) : null
}

// Render the demo in the dom
ReactDOM.render(<Page />, document.getElementById('demo'))
