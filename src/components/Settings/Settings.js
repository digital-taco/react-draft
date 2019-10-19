import React, { useContext } from 'react'
import { SettingsContext } from './SettingsProvider'

import TextInput from '../../base-components/TextInput'
import InputLabel from '../../base-components/InputLabel'

export default function Settings() {
  const { settings, updateSetting } = useContext(SettingsContext)

  return (
    <div>
      <InputLabel htmlFor="setting_demoPadding" label="Demo Padding" metaText="px" />
      <TextInput
        id="setting_demoPadding"
        type="number"
        value={settings.demoPadding}
        onChange={({ target: { value }}) => {
          updateSetting('demoPadding', value && value >= 0 ? value : 0)
        }}
      />

      <InputLabel htmlFor="setting_backgroundColor" label="Background Color" />
      <TextInput
        id="setting_backgroundColor"
        value={settings.backgroundColor}
        onChange={({ target: { value }}) => {
          updateSetting('backgroundColor', value)
        }}
      />
    </div>
  )
}