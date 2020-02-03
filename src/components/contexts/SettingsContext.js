import React, { useContext } from 'react'
import { StorageContext } from './StorageContext'
import { SETTINGS } from '../../constants/STORAGE_KEYS'

export const SettingsContext = React.createContext()

export default function SettingsProvider({ children }) {
  const { getItem, setItem } = useContext(StorageContext)

  const settings = getItem(SETTINGS, {
    demoPadding: 0,
    editDrawerSide: 'right',
  })

  const updateSetting = (settingKey, newValue) => {
    const currentSettings = getItem(SETTINGS, {
      demoPadding: 0,
      editDrawerSide: 'right',
    })
    setItem(SETTINGS, { ...currentSettings, [settingKey]: newValue })
  }

  return (
    <SettingsContext.Provider value={{ settings, updateSetting }}>
      {children}
    </SettingsContext.Provider>
  )
}
