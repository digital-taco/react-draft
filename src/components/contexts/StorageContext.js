import React from 'react'
import useStorage from './useCachedLocalStorage'

export const StorageContext = React.createContext()

export default function StorageProvider({ children }) {
  const [getItem, setItem] = useStorage()
  return <StorageContext.Provider value={{ getItem, setItem }}>{children}</StorageContext.Provider>
}
