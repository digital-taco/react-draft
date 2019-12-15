import React, { useContext } from 'react'
import { removeQuotes, isJson } from '../../lib/helpers'
import { StorageContext } from './StorageContext'
import { SELECTED_COMPONENT_HASH } from '../../constants/STORAGE_KEYS'

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
function getDefaultSelectedComponent(components) {
  const componentEntries = Object.entries(components)
  const getCount = path => (path.match(/(\/|\\)/g) || []).length
  const component = componentEntries.reduce((acc, [, Component]) => {
    if (!Component || !Component.meta) return acc
    if (getCount(acc.meta.filePath) > getCount(Component.meta.filePath)) {
      acc = Component
    }
    return acc
  }, componentEntries[0][1])

  // Must return a function that returns the component, since it is going directly into useState
  return component
}
export const SelectedContext = React.createContext()

export default function SelectedProvider({ children, components }) {
  // TEMPORARY: Aliased components do not work, so we'll remove them here
  Object.entries(components).forEach(([key, c]) => {
    if (!c) delete components[key]
  })

  const { getItem, setItem } = useContext(StorageContext)

  const selectedComponentHash = getItem(
    SELECTED_COMPONENT_HASH,
    getDefaultSelectedComponent(components).meta.componentHash
  )

  // If the stored hash is not one of the components available, get the default component to show
  if (!components[selectedComponentHash]) {
    setItem(SELECTED_COMPONENT_HASH, getDefaultSelectedComponent(components).meta.componentHash)
    // Return null, since it has to rerender to get the default selected component hash
    return null
  }

  // Find the corresponding component
  const SelectedComponent = components[selectedComponentHash]

  const selectedPropStatesKey = `DRAFT_${selectedComponentHash}_Prop_States`

  // Get/set the selected component's prop values from storage
  const propStates = getItem(
    selectedPropStatesKey,
    getPropStateDefaults(SelectedComponent.meta.props)
  )

  function getComponent(name, filePath) {
    const entry = Object.entries(components).find(([, Component]) => {
      return Component.meta.filePath === filePath && Component.meta.displayName === name
    })
    return entry ? entry[1] : null
  }

  /** Updates the currently selected component, identified by filepath */
  function updateSelectedComponent(filePath, displayName) {
    const component = getComponent(displayName, filePath)
    setItem(SELECTED_COMPONENT_HASH, component ? component.meta.componentHash : null)
  }

  /** Resets all props to their default values */
  function resetToDefaults() {
    setItem(selectedPropStatesKey, getPropStateDefaults(SelectedComponent.meta.props))
  }

  /** Updates a specific prop state */
  function updatePropState(propName, newState) {
    setItem(selectedPropStatesKey, {
      ...propStates,
      [propName]: newState,
    })
  }

  return (
    <SelectedContext.Provider
      value={{
        SelectedComponent,
        updateSelectedComponent,
        getComponent,
        propStates,
        resetToDefaults,
        updatePropState,
        getItem,
        setItem,
      }}
    >
      {children}
    </SelectedContext.Provider>
  )
}
