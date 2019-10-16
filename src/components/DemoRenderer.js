import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import DemoComponent from 'DemoFile' //eslint-disable-line
import DemoWrapper from './DemoWrapper'
import { isJson, removeQuotes } from '../lib/helpers'
import useLocalStorage from '../useLocalStorage'
import canRender from '../lib/can-render'
import ChildrenRenderer from './ChildrenRenderer'
import ErrorBox from './ErrorBox'
import SettingsProvider from './SettingsProvider'

import '../global.css'


// Add the app container so react can render
const container = document.createElement('div')
document.body.appendChild(container)
container.setAttribute('id', 'app')

// Add the babel standalone script so we can transpile jsx live
const babelStandalone = document.createElement('script')
babelStandalone.setAttribute('src', 'https://unpkg.com/@babel/standalone/babel.min.js')
babelStandalone.setAttribute('data-presets', 'es2015,react')
document.head.appendChild(babelStandalone)

// Make React available in the browser globally
window.React = React

/**
 * Gets the default states for the props
 * @param {} props
 */
function getPropStateDefaults(props) {
  if (!props) return {}
  return Object.entries(props).reduce((acc, [propName, propObj]) => {
    let defaultValue = propObj.defaultValue && propObj.defaultValue.value
    // Remove extra quotes around strings
    if (defaultValue && typeof defaultValue === 'string') {
      defaultValue = removeQuotes(defaultValue)
    }

    // Switch back to booleans from strings
    if (defaultValue === 'false' || defaultValue === 'true') {
      defaultValue = defaultValue !== 'false'
    }

    defaultValue = isJson(defaultValue) || defaultValue

    if (
      typeof defaultValue === 'string' &&
      defaultValue[0] === '{' &&
      defaultValue[defaultValue.length - 1] === '}'
    ) {
      defaultValue = eval(`() => (${defaultValue})`)() //eslint-disable-line
    }

    acc[propName] = defaultValue
    return acc
  }, {})
}

function ComponentDemo() {
  const [componentInfo, setComponentInfo] = useState()
  const [propStates, setPropStates, setKey] = useLocalStorage()

  function resetToDefaults() {
    setPropStates(getPropStateDefaults(componentInfo.props))
  }

  // WEB SOCKET
  useEffect(() => {
    const socket = new WebSocket(`ws://${window.location.hostname}:8001`)
    socket.addEventListener('message', e => {
      const message = JSON.parse(e.data)
      setComponentInfo(message)
    })

    // Let the server know we're ready for the component info
    socket.onopen = () => {
      socket.send('CONNECTED')
    }

    return socket.close
  }, [])

  useEffect(() => {
    if (!componentInfo) return
    const key = `${componentInfo.displayName}_props`
    setKey(key)
    const storedValues = JSON.parse(localStorage.getItem(key)) || {}
    const defaultValues = getPropStateDefaults(componentInfo.props)
    const currentValues = Object.entries(storedValues).reduce((acc, [propName, value]) => {
      if (value) acc[propName] = value
      return acc
    }, defaultValues)

    setPropStates(currentValues)
  }, [componentInfo])

  const canRenderComponent = componentInfo && canRender(componentInfo.props, propStates)

  return (
    <SettingsProvider>
      {componentInfo && propStates && (
        <DemoWrapper
          displayName={componentInfo.displayName}
          propObjects={componentInfo.props}
          propStates={propStates}
          setPropStates={setPropStates}
          resetToDefaults={resetToDefaults}
        >
          {/* DEMO COMPONENT */}
          {canRenderComponent && (
            <DemoComponent {...propStates}>
              <ChildrenRenderer value={propStates.children} />
            </DemoComponent>
          )}

          {/* MISSING REQUIRED PROPS */}
          {!canRenderComponent && (
            <ErrorBox>
              All required props must be given a value
            </ErrorBox>
          )}
        </DemoWrapper>
      )}
    </SettingsProvider>
  )
}

// Render the demo in the dom
ReactDOM.render(<ComponentDemo />, document.getElementById('app'))
