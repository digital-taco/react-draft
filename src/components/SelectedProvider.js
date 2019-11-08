import React, { useState } from 'react'
import { removeQuotes, isJson } from '../lib/helpers'

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
function getDefaultSelectedComponent(componentEntries) {
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

export const SelectedContext = React.createContext()

export default function SelectedProvider({ children, componentEntries }) {
  const [SelectedComponent, setSelectedComponent] = useState(
    getDefaultSelectedComponent(componentEntries)
  )

  const [propStates, setPropStates] = useState(getPropStateDefaults(SelectedComponent.meta.props))

  /** Updates the currently selected component, identified by filepath */
  function updateSelectedComponent(filePath, displayName) {
    const componentEntry = componentEntries.find(([, Component]) => {
      return Component.meta.filePath === filePath && Component.meta.displayName === displayName
    })
    setSelectedComponent(() => componentEntry[1])
  }

  /** Resets all props to their default values */
  function resetToDefaults() {
    setPropStates(getPropStateDefaults(SelectedComponent.meta.props))
  }

  function updatePropState(propName, newState) {
    setPropStates(oldPropStates => ({
      ...oldPropStates,
      [propName]: newState,
    }))
  }

  return (
    <SelectedContext.Provider
      value={{
        SelectedComponent,
        updateSelectedComponent,
        propStates,
        setPropStates,
        resetToDefaults,
        updatePropState,
      }}
    >
      {children}
    </SelectedContext.Provider>
  )
}
