import React, { useContext } from 'react'
import { SettingsContext } from '../contexts/SettingsContext'
import { css } from '@emotion/core'
import TextInput from '../common/TextInput'
import InputLabel from '../common/InputLabel'
import { H3 } from '../common/Headers'

const settingsCss = css`
  padding: 8px 16px 0;
`

export default function Settings() {
  const { settings, updateSetting } = useContext(SettingsContext)

  return (
    <div css={settingsCss}>
      <InputLabel htmlFor="setting_demoPadding" label="Demo Padding" metaText="px" />
      <TextInput
        id="setting_demoPadding"
        type="number"
        value={settings.demoPadding}
        onChange={({ target: { value } }) => {
          updateSetting('demoPadding', value && value >= 0 ? value : 0)
        }}
      />

      <InputLabel htmlFor="setting_backgroundColor" label="Background Color" />
      <TextInput
        id="setting_backgroundColor"
        value={settings.backgroundColor}
        onChange={({ target: { value } }) => {
          updateSetting('backgroundColor', value)
        }}
      />
    </div>
  )
}
