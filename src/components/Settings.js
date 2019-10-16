import React, { useContext } from 'react'
import { SettingsContext } from './SettingsProvider'

import TextInput from '../base-components/TextInput'
import { H1, H3 } from '../base-components/Headers'

export default function Settings() {
  const { settings, updateSetting } = useContext(SettingsContext)

  const updateDemoPadding = ({ target: { value }}) => {
    updateSetting('demoPadding',value && value >= 0 ? value : 0)
  }

  return (
    <div>
      <H1>Settings</H1>
      <H3>Demo Padding</H3>
      <TextInput type="number" value={settings.demoPadding} onChange={updateDemoPadding} />
    </div>
  )
}
