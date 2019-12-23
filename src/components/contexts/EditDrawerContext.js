import React, { useContext } from 'react'
import { StorageContext } from './StorageContext'
import {
  EDIT_DRAWER_ITEM,
  EDIT_DRAWER_IS_OPEN,
  // EDIT_DRAWER_VALUE,
} from '../../constants/STORAGE_KEYS'

export const EditDrawerContext = React.createContext()

export default function EditDrawerProvider({ children }) {
  const { getItem, setItem } = useContext(StorageContext)

  const editItem = getItem(EDIT_DRAWER_ITEM, null)
  const editDrawerIsOpen = getItem(EDIT_DRAWER_IS_OPEN, false)

  const setEditItem = newEditItem => setItem(EDIT_DRAWER_ITEM, newEditItem)

  const toggleDrawer = () => setItem(EDIT_DRAWER_IS_OPEN, !editDrawerIsOpen)
  const closeEditDrawer = () => setItem(EDIT_DRAWER_ITEM, null)

  return (
    <EditDrawerContext.Provider
      value={{
        editItem,
        setEditItem,
        editDrawerIsOpen,
        toggleDrawer,
        closeEditDrawer,
      }}
    >
      {children}
    </EditDrawerContext.Provider>
  )
}
