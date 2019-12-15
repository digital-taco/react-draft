import React, { createContext, useContext } from 'react'
import useStorage from './useCachedLocalStorage'
import { TABS, TEMP_TAB } from '../../constants/STORAGE_KEYS'
import { SelectedContext } from './SelectedContext'

export const TabsContext = createContext('TabsContext')

export default function TabsProvider({ children }) {
  const { getComponent, updateSelectedComponent } = useContext(SelectedContext)
  const [getItem, setItem] = useStorage()
  const tabs = getItem(TABS, [])
  const tempTab = getItem(TEMP_TAB, null)

  function addTab(name, filePath) {
    const component = getComponent(name, filePath)
    setItem(TABS, [{ filePath, name, componentHash: component.meta.componentHash }, ...tabs])
    if (component.meta.componentHash === tempTab.componentHash) {
      setItem(TEMP_TAB, null)
    }
    updateSelectedComponent(filePath, name)
  }
  
  function removeTab(componentHash) {
    if (tempTab && componentHash === tempTab.componentHash) {
      setItem(TEMP_TAB, null)
    } else {
      const index = tabs.findIndex(t => t.componentHash === componentHash)
      if (index !== -1) {
        setItem(TABS, [...tabs.slice(0, index), ...tabs.slice(index + 1, tabs.length)])
      }
    }
  }

  function setTempTab(name, filePath) {
    const component = getComponent(name, filePath)
    setItem(TEMP_TAB, { name, filePath, componentHash: component.meta.componentHash })
    updateSelectedComponent(filePath, name)
  }

  return (
    <TabsContext.Provider value={{
      tabs,
      tempTab,
      addTab,
      removeTab,
      setTempTab,
    }}>
      {children}
    </TabsContext.Provider>
  )
}
