import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import * as Components from 'ExportsList' //eslint-disable-line
import DemoWrapper from './DemoWrapper'
import { isJson, removeQuotes } from '../lib/helpers'
import useLocalStorage from '../useLocalStorage'
import canRender from '../lib/can-render'
import ChildrenRenderer from './ChildrenRenderer'
import ErrorBox from './ErrorBox'
import SettingsProvider from './Settings/SettingsProvider'

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

const componentEntries = Object.entries(Components)
const componentTree = Components.default

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

/** Identifies the component with the shortest path */
function getDefaultSelectedComponent() {
  const getCount = path => (path.match(/(\/|\\)/g) || []).length
  const component = componentEntries.reduce((acc, [, Component]) => {
    if (!Component.meta) return acc
    if (getCount(acc.meta.filePath) > getCount(Component.meta.filePath)) {
      acc = Component
    }
    return acc
  }, componentEntries[0][1])

  // Must return a function that returns the component, since it is going directly into useState
  return () => component
}

function ComponentDemo() {
  const [SelectedComponent, setSelectedComponent] = useState(getDefaultSelectedComponent())
  const storageKey = `${SelectedComponent.meta.displayName}_props`
  const [propStates, setPropStates] = useLocalStorage(storageKey, getPropStates())

  /** Combines what's in local storage with the default values from the component information */
  function getPropStates() {
    const storedValues = JSON.parse(localStorage.getItem(storageKey)) || {}
    const defaultValues = getPropStateDefaults(SelectedComponent.meta.props)
    return Object.entries(storedValues).reduce((acc, [propName, value]) => {
      if (value) acc[propName] = value
      return acc
    }, defaultValues)
  }

  /** Resets all props to their default values */
  function resetToDefaults() {
    setPropStates(getPropStateDefaults(SelectedComponent.meta.props))
  }

  /** Updates the currently selected component, identified by filepath */
  function updateSelectedComponent(filePath) {
    const componentEntry = componentEntries.find(([, Component]) => {
      return Component.meta.filePath === filePath
    })
    setSelectedComponent(() => componentEntry[1])
  }

  const canRenderComponent = propStates && canRender(SelectedComponent.meta.props, propStates)

  return (
    <SettingsProvider>
      {canRenderComponent && (
        <DemoWrapper
          displayName={SelectedComponent.meta.displayName}
          propObjects={SelectedComponent.meta.props}
          propStates={propStates}
          setPropStates={setPropStates}
          resetToDefaults={resetToDefaults}
          componentTree={componentTree}
          SelectedComponent={SelectedComponent}
          updateSelectedComponent={updateSelectedComponent}
        >
          {/* DEMO COMPONENT */}
          <SelectedComponent {...propStates}>
            <ChildrenRenderer value={propStates.children} />
          </SelectedComponent>

          {/* MISSING REQUIRED PROPS */}
          {!canRenderComponent && <ErrorBox>All required props must be given a value</ErrorBox>}
        </DemoWrapper>
      )}
    </SettingsProvider>
  )
}

// Render the demo in the dom
ReactDOM.render(<ComponentDemo />, document.getElementById('app'))
