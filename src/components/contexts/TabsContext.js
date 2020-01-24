import React, { createContext, useContext } from 'react'
import useStorage from './useCachedLocalStorage'
import { TABS, TEMP_TAB } from '../../constants/STORAGE_KEYS'
import { SelectedContext } from './SelectedContext'

export const TabsContext = createContext('TabsContext')

export default function TabsProvider({ children }) {
  const { getComponent, SelectedComponent, updateSelectedComponent } = useContext(SelectedContext)
  const [getItem, setItem] = useStorage()
  const tabs = getItem(TABS, [])
  const tempTab = getItem(TEMP_TAB, null)

  function addTab(name, filePath) {
    const component = getComponent(name, filePath)
    setItem(TABS, [{ filePath, name, componentHash: component.componentHash }, ...tabs])
    if (tempTab && component.componentHash === tempTab.componentHash) {
      setItem(TEMP_TAB, null)
    }
  }

  function removeTab(componentHash) {
    if (tempTab && componentHash === tempTab.componentHash) {
      setItem(TEMP_TAB, null)
      const newTab = tabs[0] || {}
      updateSelectedComponent(newTab.filePath, newTab.name)
      return
    }

    const index = tabs.findIndex(t => t.componentHash === componentHash)
    if (index !== -1) {
      setItem(TABS, [...tabs.slice(0, index), ...tabs.slice(index + 1, tabs.length)])
    }

    if (componentHash === SelectedComponent.componentHash) {
      let newFocusTabIndex = index - 1
      newFocusTabIndex = newFocusTabIndex <= 0 ? 1 : newFocusTabIndex
      newFocusTabIndex = index === 1 ? 0 : newFocusTabIndex
      const newSelectedComponentTab = tabs[newFocusTabIndex] || {}
      updateSelectedComponent(newSelectedComponentTab.filePath, newSelectedComponentTab.name)
    }
  }

  function setTempTab(name, filePath) {
    const component = getComponent(name, filePath)
    setItem(TEMP_TAB, { name, filePath, componentHash: component.componentHash })
  }

  return (
    <TabsContext.Provider
      value={{
        tabs,
        tempTab,
        addTab,
        removeTab,
        setTempTab,
      }}
    >
      {children}
    </TabsContext.Provider>
  )
}
