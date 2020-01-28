import React, { useContext } from 'react'
import { removeQuotes, isJson } from '../../lib/helpers'
import { StorageContext } from './StorageContext'
import { SELECTED_COMPONENT_HASH } from '../../constants/STORAGE_KEYS'
import EmptyDemo from '../demo/EmptyDemo'
import { GlossaryContext } from './GlossaryContext'

const quoteRegExp = /['"]/

/**
 * Gets the default states for the props
 * @param {} props
 */
function getPropStateDefaults(props) {
  if (!props) return {}
  return Object.entries(props).reduce((acc, [propName, propObj]) => {
    let defaultValue = propObj.defaultValue && propObj.defaultValue.value
    // Remove extra quotes around strings
    if (
      defaultValue &&
      typeof defaultValue === 'string' &&
      quoteRegExp.test(defaultValue[0]) &&
      quoteRegExp.test(defaultValue[defaultValue.length - 1])
    ) {
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

export const SelectedContext = React.createContext()

export default function SelectedProvider({ children }) {
  const componentGlossary = useContext(GlossaryContext)

  // TEMPORARY: Aliased components do not work, so we'll remove them here
  Object.entries(componentGlossary).forEach(([key, c]) => {
    if (!c) delete componentGlossary[key]
  })

  const { getItem, setItem } = useContext(StorageContext)

  const selectedComponentHash = getItem(SELECTED_COMPONENT_HASH)

  // Find the corresponding component
  const SelectedComponent = componentGlossary[selectedComponentHash] || {
    componentHash: 'EmptyDemo',
  }

  const selectedPropStatesKey = `DRAFT_${selectedComponentHash}_Prop_States`

  // Get/set the selected component's prop values from storage
  const propStates = getItem(selectedPropStatesKey, getPropStateDefaults(SelectedComponent.props))

  function getComponent(name, filePath) {
    const entry = Object.entries(componentGlossary).find(([, Component]) => {
      if (!Component) return false
      return Component.filePath === filePath && Component.displayName === name
    })
    return entry ? entry[1] : null
  }

  /** Updates the currently selected component, identified by filepath */
  function updateSelectedComponent(filePath, displayName) {
    const component = getComponent(displayName, filePath)
    setItem(SELECTED_COMPONENT_HASH, component ? component.componentHash : EmptyDemo.componentHash)
  }

  /** Resets all props to their default values */
  function resetToDefaults() {
    setItem(selectedPropStatesKey, getPropStateDefaults(SelectedComponent.props))
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
